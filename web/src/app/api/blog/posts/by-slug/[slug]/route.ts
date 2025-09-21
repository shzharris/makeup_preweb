import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const last = segments[segments.length - 1] || '';
  const slug = last ? decodeURIComponent(last) : '';
  if (!slug) return NextResponse.json({ error: 'missing slug' }, { status: 400 });

  const row = await getBlogPostBySlug(slug);
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    title: row.title,
    slug: row.slug ?? '',
    description: row.description ?? '',
    readMinutes: row.read_minutes,
    createdAt: row.created_at,
    source: row.source ?? '',
    previewImageUrl: row.preview_image_url ?? '',
    content: row.content,
    contentJson: row.content_json,
    tags: row.tags,
  });
}


