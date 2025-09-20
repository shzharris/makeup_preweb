"use client";
import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { 
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  ImageIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from "lucide-react";

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  processedAt: string;
  status: 'completed' | 'processing' | 'failed';
  isPublic?: boolean;
}

export function BeautyGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [imageDisplayStates, setImageDisplayStates] = useState<Record<string, 'original' | 'enhanced'>>({});
  const [items, setItems] = useState<ProcessedImage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState("");
  const [viewerAlt, setViewerAlt] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const offset = (currentPage - 1) * itemsPerPage;
        const res = await fetch(`/api/public/photos?limit=${itemsPerPage}&offset=${offset}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as { total?: number; items: ProcessedImage[] };
        if (!cancelled) {
          setItems(json.items || []);
          setTotal((prev) => (currentPage === 1 ? (json.total ?? prev) : prev));
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [currentPage]);

  const totalPages = Math.ceil((total || 0) / itemsPerPage);
  const currentImages = items;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const toggleImageView = (imageId: string) => {
    setImageDisplayStates((prev) => {
      const current = prev[imageId] ?? 'original';
      const next = current === 'original' ? 'enhanced' : 'original';
      return { ...prev, [imageId]: next };
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Discover User&apos;s Makeup
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
            Explore our community&apos;s amazing looks, all proactively shared by users.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-3xl p-8 mb-8">
      {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        {loading && (
          <div className="mb-4 text-pink-600 text-center">Loading...</div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentImages.map((image) => {
            const currentView = imageDisplayStates[image.id] || 'original';
            const isEnhanced = currentView === 'enhanced';
            
            return (
              <Card 
                key={image.id} 
                className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-pink-200 hover:border-pink-300"
              >
                <div
                  className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 border-2 border-pink-100 relative cursor-zoom-in"
                  style={{ perspective: '1000px' }}
                  onClick={() => {
                    const currentSrc = isEnhanced ? image.processedUrl : image.originalUrl;
                    setViewerSrc(currentSrc);
                    setViewerAlt(isEnhanced ? "Enhanced beauty photo" : "Original photo");
                    setViewerOpen(true);
                  }}
                >
                  <div className="w-full h-full relative" style={{ transform: isEnhanced ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.6s', transformStyle: 'preserve-3d' }}>
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' as const }}>
                      <ImageWithFallback
                        src={image.originalUrl}
                        alt="Original photo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' as const }}>
                      <ImageWithFallback
                        src={image.processedUrl}
                        alt="Enhanced beauty photo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-pink-600">
                    <ClockIcon className="w-3 h-3" />
                    <span>{image.processedAt}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => toggleImageView(image.id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs h-7 px-3 transition-all duration-200"
                    >
                      <EyeIcon className="w-3 h-3 mr-1" />
                      {isEnhanced ? "View Original" : "View Results"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty state for when no images on current page */}
        {currentImages.length === 0 && (
          <div className="text-center py-16 text-pink-600">
            <div className="relative inline-block">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <SparklesIcon className="w-6 h-6 absolute -top-1 -right-1 text-pink-400 animate-pulse" />
            </div>
            <p className="text-lg">No photos found on this page</p>
            <p className="text-sm text-pink-500 mt-2">Try navigating to a different page ✨</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {getVisiblePageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-pink-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    className={
                      currentPage === page
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                        : "border-pink-300 text-pink-700 hover:bg-pink-50"
                    }
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setViewerOpen(false)} />
          <div className="relative max-w-5xl w-[90%] max-h-[90vh] bg-white rounded-xl shadow-2xl p-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black">
              <ImageWithFallback
                src={viewerSrc}
                alt={viewerAlt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => setViewerOpen(false)} className="bg-pink-500 hover:bg-pink-600 text-white">Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Page() {
  return <BeautyGallery />;
}