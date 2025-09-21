import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { listBlogPosts } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/makeup_analysis`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/discover_makeup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/makeup_tips`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    // 拉取部分最新文章（例如最多 200 条）
    const posts = await listBlogPosts({ limit: 200, offset: 0 })
    for (const p of posts) {
      const slug = (p.slug as string | undefined) || ''
      if (!slug) continue
      entries.push({
        url: `${base}/makeup_tips_detail/${encodeURIComponent(slug)}`,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: 'monthly',
        priority: 0.4,
      })
    }
  } catch {
    // ignore
  }

  return entries
}


