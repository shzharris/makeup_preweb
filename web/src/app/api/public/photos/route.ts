import { NextRequest, NextResponse } from "next/server";
import { listPublicMakeupPhotos, countPublicMakeupPhotos } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 24);
  const offset = Number(searchParams.get("offset") ?? 0);

  const items = await listPublicMakeupPhotos({ limit, offset });
  const data = items.map((r) => ({
    id: r.id,
    originalUrl: r.original_url,
    processedUrl: r.processed_url ?? "",
    processedAt: r.completed_at ?? r.created_at,
    status: (r.status as "completed" | "processing" | "failed" | null) ?? "completed",
    isPublic: r.is_public === 1,
  }));

  const body: Record<string, unknown> = { items: data };
  if (offset === 0) {
    body.total = await countPublicMakeupPhotos();
  }

  const res = NextResponse.json(body);
  res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
  return res;
}


