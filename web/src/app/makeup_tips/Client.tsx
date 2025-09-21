"use client";
import { useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from '../../components/figma/ImageWithFallback'
import { SimpleImagePlaceholder } from '../../components/figma/imagePlaceholder'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Clock, BookOpen, ChevronLeftIcon, ChevronRightIcon, ImageIcon, SparklesIcon } from 'lucide-react'

type BlogPostItem = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  previewImageUrl: string;
  readMinutes: number;
  createdAt: string;
  source: string;
  content: string;
  tags?: Array<{ id: string; name: string }>
}

export default function MakeupTipsClient({ initialTag = "" }: { initialTag?: string }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const [total, setTotal] = useState(0)
  const [currentTips, setCurrentTips] = useState<BlogPostItem[]>([])
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([])
  const [activeTag, setActiveTag] = useState<string>(initialTag)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const offset = (currentPage - 1) * itemsPerPage
      const qs = new URLSearchParams({ limit: String(itemsPerPage), offset: String(offset), ...(activeTag ? { tag: activeTag } : {}) })
      const res = await fetch(`/api/blog/posts?${qs.toString()}`)
      if (!res.ok) return
      const json = await res.json() as { total?: number; items: BlogPostItem[] }
      if (cancelled) return
      setCurrentTips(json.items || [])
      if (currentPage === 1 && typeof json.total === 'number') setTotal(json.total)
    }
    load()
    return () => { cancelled = true }
  }, [currentPage, activeTag])

  useEffect(() => {
    let cancelled = false
    const loadTags = async () => {
      const res = await fetch('/api/blog/tags')
      if (!res.ok) return
      const json = await res.json() as { items: Array<{ id: string; name: string }> }
      if (!cancelled) setTags(json.items || [])
    }
    loadTags()
    return () => { cancelled = true }
  }, [])

  const totalPages = Math.ceil((total || 0) / itemsPerPage)

  return (
    <div className="bg-background">
      <div className="text-center mb-12">
        <div className="max-w-6xl mx-auto px-4 py-12 ">
          <h1 className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Makeup Tips
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn practical techniques and product advice to elevate your makeup game.
          </p>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="max-w-6xl mx-auto px-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button
              variant={activeTag ? 'outline' : 'default'}
              size="sm"
              onClick={() => { setActiveTag(""); setCurrentPage(1); router.push('/makeup_tips') }}
              className={activeTag ? 'border-pink-300 text-pink-700 hover:bg-pink-50' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'}
            >
              All
            </Button>
            {tags.map(t => (
              <Button
                key={t.id}
                variant={activeTag.toLowerCase() === t.name.toLowerCase() ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setActiveTag(t.name); setCurrentPage(1); router.push(`/makeup_tips?tag=${encodeURIComponent(t.name)}`) }}
                className={activeTag.toLowerCase() === t.name.toLowerCase()
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'border-pink-300 text-pink-700 hover:bg-pink-50'}
              >
                {t.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Tips List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {currentTips.map((tip) => (
            <Card key={tip.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-pink-200 hover:border-pink-300">
              <CardContent className="p-0 [&:last-child]:pb-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-64 aspect-[4/3] flex-shrink-0">
                    {tip.previewImageUrl ? (
                      <ImageWithFallback
                        src={tip.previewImageUrl}
                        alt={tip.title}
                        className="w-full h-full object-cover md:rounded-none md:rounded-l-lg"
                      />
                    ) : (
                      <SimpleImagePlaceholder className="w-full h-full" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 px-6 pt-6 pb-0 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tip.tags && tip.tags.length > 0 ? (
                          tip.tags.map(t => (
                            <Badge key={t.id} variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                              {t.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                            Blog
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-medium mb-3 text-foreground hover:text-primary cursor-pointer transition-colors">
                        {tip.title}
                      </h3>
                      {tip.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {tip.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pb-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tip.readMinutes} min</span>
                        </div>
                      </div>
                      {tip.slug ? (
                        <Button 
                          asChild
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                          size="sm"
                        >
                          <Link href={`/makeup_tips_detail/${encodeURIComponent(tip.slug)}`}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Read Tutorial
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          disabled
                          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white opacity-60"
                          size="sm"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Tutorial
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Empty state */}
        {currentTips.length === 0 && (
          <div className="text-center py-16 text-pink-600">
            <div className="relative inline-block">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <SparklesIcon className="w-6 h-6 absolute -top-1 -right-1 text-pink-400 animate-pulse" />
            </div>
            <p className="text-lg">No articles found</p>
            <p className="text-sm text-pink-500 mt-2">Try another tag or check back later ✨</p>
          </div>
        )}
        {/** Pagination */}
        {Math.ceil((total || 0) / itemsPerPage) > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil((total || 0) / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => page === 1 || page === Math.ceil((total || 0) / itemsPerPage) || Math.abs(page - currentPage) <= 2)
                .reduce<number[]>((acc, page) => {
                  if (acc.length === 0 || acc[acc.length - 1] + 1 === page) acc.push(page);
                  else acc.push(NaN, page);
                  return acc;
                }, [])
                .map((pageOrDot, idx) => (
                  <div key={idx}>
                    {Number.isNaN(pageOrDot) ? (
                      <span className="px-2 py-1 text-pink-500">...</span>
                    ) : (
                      <Button
                        variant={currentPage === pageOrDot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageOrDot)}
                        className={
                          currentPage === pageOrDot
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                            : "border-pink-300 text-pink-700 hover:bg-pink-50"
                        }
                      >
                        {pageOrDot}
                      </Button>
                    )}
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(Math.ceil((total || 0) / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil((total || 0) / itemsPerPage)}
              className="border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-50"
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


