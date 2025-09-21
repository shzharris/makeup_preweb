import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { getBlogPostBySlug } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const p = await params;
  const slugParam = p?.slug;
  const raw = Array.isArray(slugParam) ? (slugParam[0] || "") : (slugParam || "");
  const slug = raw ? decodeURIComponent(raw) : "";
  if (!slug) return {};

  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) return {};
    const title = `${post.title}｜Makeup Insight AI`;
    const description = post.description || undefined;
    const canonical = `${siteUrl}/makeup_tips_detail/${encodeURIComponent(post.slug || slug)}`;
    const images = post.preview_image_url ? [{ url: post.preview_image_url, width: 1200, height: 630, alt: post.title }] : undefined;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "article",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: images?.map(i => i.url),
      },
    };
  } catch {
    return {};
  }
}

export default function DetailLayout({ children, params }: { children: React.ReactNode; params: Promise<Record<string, string | string[] | undefined>> }) {
  void params;
  return children;
}


