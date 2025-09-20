import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/makeup_analysis`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/discover_makeup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/makeup_tips`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}


