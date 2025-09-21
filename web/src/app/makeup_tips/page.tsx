import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'
import MakeupTipsClient from './Client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const sp = await searchParams
  const tagParam = sp?.tag
  const tag = Array.isArray(tagParam) ? (tagParam[0] || '') : (tagParam || '')
  const baseTitle = 'Makeup Tips'
  const title = tag ? `${tag} | ${baseTitle}` : baseTitle
  const description = tag ? `Read makeup tips about ${tag}.` : 'Browse our makeup tips: curated makeup tutorials, tips and insights.'
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

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const tagParam = sp?.tag
  const tag = Array.isArray(tagParam) ? (tagParam[0] || '') : (tagParam || '')
  return <MakeupTipsClient initialTag={tag as string} />
}