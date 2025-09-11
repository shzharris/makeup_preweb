"use client";
import { useState } from "react";
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


  // Mock data for 50+ processed images
  const allProcessedImages: ProcessedImage[] = [
    {
      id: "1",
      originalUrl: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 14:30",
      status: 'completed',
      isPublic: true
    },
    {
      id: "2", 
      originalUrl: "https://images.unsplash.com/photo-1590393802710-dbf451560939?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1590393802710-dbf451560939?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 13:45",
      status: 'completed',
      isPublic: true
    },
    {
      id: "3",
      originalUrl: "https://images.unsplash.com/photo-1594646996739-9ea802039fe3?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1594646996739-9ea802039fe3?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 12:20",
      status: 'completed',
      isPublic: true
    },
    {
      id: "4",
      originalUrl: "https://images.unsplash.com/photo-1623601903065-0d5b4ae594d4?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1623601903065-0d5b4ae594d4?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 11:15",
      status: 'completed',
      isPublic: true
    },
    {
      id: "5",
      originalUrl: "https://images.unsplash.com/photo-1605813809066-0773a4e7e50e?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1605813809066-0773a4e7e50e?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 16:30",
      status: 'completed',
      isPublic: true
    },
    {
      id: "6",
      originalUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 15:45",
      status: 'completed',
      isPublic: true
    },
    {
      id: "7",
      originalUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 14:20",
      status: 'completed',
      isPublic: true
    },
    {
      id: "8",
      originalUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 13:30",
      status: 'completed',
      isPublic: true
    },
    {
      id: "9",
      originalUrl: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 12:15",
      status: 'completed',
      isPublic: true
    },
    {
      id: "10",
      originalUrl: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 11:45",
      status: 'completed',
      isPublic: true
    },
    {
      id: "11",
      originalUrl: "https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 18:30",
      status: 'completed',
      isPublic: true
    },
    {
      id: "12",
      originalUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 17:15",
      status: 'completed',
      isPublic: true
    },
    {
      id: "13",
      originalUrl: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 16:45",
      status: 'completed',
      isPublic: true
    },
    {
      id: "14",
      originalUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 15:20",
      status: 'completed',
      isPublic: true
    },
    {
      id: "15",
      originalUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 14:30",
      status: 'completed',
      isPublic: true
    },
    {
      id: "16",
      originalUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 13:45",
      status: 'completed',
      isPublic: true
    },
    {
      id: "17",
      originalUrl: "https://images.unsplash.com/photo-1582992086267-a8a6c8c6e84c?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1582992086267-a8a6c8c6e84c?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 12:30",
      status: 'completed',
      isPublic: true
    },
    {
      id: "18",
      originalUrl: "https://images.unsplash.com/photo-1595475038665-8b30a3e4c4ae?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1595475038665-8b30a3e4c4ae?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 11:15",
      status: 'completed',
      isPublic: true
    },
    {
      id: "19",
      originalUrl: "https://images.unsplash.com/photo-1619194617062-5a61b698e548?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1619194617062-5a61b698e548?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-13 10:45",
      status: 'completed',
      isPublic: true
    },
    {
      id: "20",
      originalUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-12 19:30",
      status: 'completed',
      isPublic: true
    },
    // Add more items for pagination demo
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `${21 + i}`,
      originalUrl: `https://images.unsplash.com/photo-160547408250${(i % 9) + 1}?w=300&h=300&fit=crop`,
      processedUrl: `https://images.unsplash.com/photo-160547408250${(i % 9) + 1}?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2`,
      processedAt: `2024-01-${12 - Math.floor(i / 5)} ${10 + (i % 12)}:${15 + (i % 4) * 15}`,
      status: 'completed' as const,
      isPublic: true
    }))
  ];

  const totalPages = Math.ceil(allProcessedImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = allProcessedImages.slice(startIndex, startIndex + itemsPerPage);

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
    setImageDisplayStates(prev => ({
      ...prev,
      [imageId]: prev[imageId] === 'original' ? 'enhanced' : 'original'
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Discover Makeup
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
            Explore our community's amazing looks, all proactively shared by users.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-3xl p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentImages.map((image) => {
            const currentView = imageDisplayStates[image.id] || 'enhanced';
            const displayUrl = currentView === 'original' ? image.originalUrl : image.processedUrl;
            
            return (
              <Card 
                key={image.id} 
                className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-pink-200 hover:border-pink-300"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 border-2 border-pink-100 relative">
                  <ImageWithFallback
                    src={displayUrl}
                    alt={currentView === 'original' ? "Original photo" : "Enhanced beauty photo"}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Button
                      size="sm"
                      onClick={() => toggleImageView(image.id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs h-6 px-2 transition-all duration-200"
                    >
                      <EyeIcon className="w-2 h-2 mr-1" />
                      View Results
                    </Button>
                  </div>
                
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-pink-600">
                    <ClockIcon className="w-3 h-3" />
                    <span>{image.processedAt}</span>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-700 border-green-200 w-full justify-center"
                  >
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Public Gallery
                  </Badge>
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

    </div>
  );
}

export default function Page() {
  return <BeautyGallery />;
}