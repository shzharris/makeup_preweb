import { NextRequest, NextResponse } from "next/server";
import { listBlogPosts, countBlogPosts, getBlogPostById } from "@/lib/db";

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? 15);
    const offset = Number(searchParams.get("offset") ?? 0);
    const tag = searchParams.get("tag") ?? undefined;

    const rows = await listBlogPosts({ limit, offset, tag: tag || undefined });
    // 尝试补充 tags（如果存在关联表则读取；失败则忽略）
    const items = await Promise.all(rows.map(async (r) => {
      try {
        const detail = await getBlogPostById(r.id);
        return {
          id: r.id,
          title: r.title,
          slug: r.slug ?? '',
          readMinutes: r.read_minutes,
          createdAt: r.created_at,
          source: r.source ?? "",
          previewImageUrl: r.preview_image_url ?? "",
          description: r.description ?? "",
          tags: detail?.tags ?? [],
        };
      } catch {
        return {
          id: r.id,
          title: r.title,
          slug: r.slug ?? '',
          readMinutes: r.read_minutes,
          createdAt: r.created_at,
          source: r.source ?? "",
          previewImageUrl: r.preview_image_url ?? "",
          description: r.description ?? "",
          tags: [],
        };
      }
    }));

    const body: Record<string, unknown> = { items };
    if (offset === 0) {
      body.total = await countBlogPosts({ tag: tag || undefined });
    }

    const res = NextResponse.json(body);
    res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res;
  } catch (e) {
    console.error('[api/blog/posts] error', e);
    return NextResponse.json({ error: 'internal_error', detail: String(e) }, { status: 500 });
  }
}


