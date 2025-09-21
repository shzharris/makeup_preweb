"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { SimpleImagePlaceholder } from "../../../components/figma/imagePlaceholder";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

type Detail = {
  id: string;
  title: string;
  slug?: string;
  description: string;
  readMinutes: number;
  createdAt: string;
  source: string;
  previewImageUrl: string;
  content?: string | null;
  tags?: Array<{ id: string; name: string }>;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const raw = (params?.slug as string) || "";
  const slug = raw ? decodeURIComponent(raw) : "";

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      const res = await fetch(`/api/blog/posts/by-slug/${encodeURIComponent(slug)}`);
      if (!res.ok) { setLoading(false); return; }
      const json = await res.json() as Detail;
      if (!cancelled) { setDetail(json); setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (!slug) return null;

  return (
    <div className="bg-background">
      <div className="border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/makeup_tips')}
            className="mb-6 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tips List
          </Button>

          {detail && (
            <div className="flex flex-wrap gap-2 mb-6">
              {detail.tags?.map(t => (
                <Link key={t.id} href={`/makeup_tips?tag=${encodeURIComponent(t.name)}`}>
                  <Badge
                    asChild={false}
                    variant="secondary"
                    className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:opacity-90 cursor-pointer"
                  >
                    {t.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {detail?.title || (loading ? 'Loading...' : 'Not Found')}
          </h1>

          {detail && (
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{detail.readMinutes} min</span>
                </div>
              </div>
            </div>
          )}

          {detail && (
            <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 bg-white/50">
              <p className="text-sm italic text-muted-foreground text-left">
                {detail.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {detail?.previewImageUrl ? (
          <div className="flex justify-center mb-8">
            <div className="aspect-[4/3] max-w-2xl overflow-hidden rounded-lg">
              <ImageWithFallback
                src={detail.previewImageUrl}
                alt={detail.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <div className="aspect-[4/3] max-w-2xl overflow-hidden rounded-lg">
              <SimpleImagePlaceholder className="w-full h-full" />
            </div>
          </div>
        )}

        {detail && (
          <div className="max-w-3xl mx-auto">
            {detail.content ? (
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {detail.content}
              </div>
            ) : (
              <p className="text-muted-foreground">No content</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


