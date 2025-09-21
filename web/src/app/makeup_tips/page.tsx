import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'
import MakeupTipsClient from './Client'

export const dynamic = 'force-dynamic'

export function generateMetadata({ searchParams }: { searchParams: { tag?: string } }): Metadata {
  const tag = searchParams?.tag || ''
  const baseTitle = 'Blog'
  const title = tag ? `${tag} | ${baseTitle}` : baseTitle
  const description = tag ? `Read blog posts about ${tag}.` : 'Browse our blog: curated makeup tutorials, tips and insights.'
  const canonical = tag ? `${siteUrl}/makeup_tips?tag=${encodeURIComponent(tag)}` : `${siteUrl}/makeup_tips`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website'
    }
  }
}

export default function Page({ searchParams }: { searchParams: { tag?: string } }) {
  const tag = searchParams?.tag || ''
  return <MakeupTipsClient initialTag={tag} />
}