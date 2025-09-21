"use client";
import { useState} from "react";
import { ImageWithFallback } from '../../components/figma/ImageWithFallback'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Clock, Heart, BookOpen, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface MakeupTip {
  id: number
  title: string
  description: string
  image: string
  category: string
  readTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  likes: number
}

// Mock data for makeup tips
const mockMakeupTips: MakeupTip[] = [
  {
    id: 1,
    title: "Perfect Smoky Eye Tutorial",
    description: "Master the art of creating sultry, dramatic smoky eyes that work for any occasion. Learn professional blending techniques and color selection.",
    image: "https://images.unsplash.com/photo-1585049303349-6680e6179692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjB0dXRvcmlhbCUyMGJlYXV0eSUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgzNzgyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Eye Makeup",
    readTime: "8 min",
    difficulty: "Intermediate",
    likes: 324
  },
  {
    id: 2,
    title: "Long-Lasting Lipstick Application",
    description: "Discover the secret to making your lipstick last all day. From primer to setting techniques, get professional results every time.",
    image: "https://images.unsplash.com/photo-1663693608907-e512a86606bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXBzdGljayUyMG1ha2V1cCUyMGFwcGxpY2F0aW9ufGVufDF8fHx8MTc1ODM3ODIxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Lip Makeup",
    readTime: "5 min",
    difficulty: "Beginner",
    likes: 198
  },
  {
    id: 3,
    title: "Foundation & Contouring Basics",
    description: "Learn how to choose the right foundation shade and apply it flawlessly. Master basic contouring techniques to enhance your natural features.",
    image: "https://images.unsplash.com/photo-1645017324561-5de0e0739ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3VuZGF0aW9uJTIwY29udG91cmluZyUyMG1ha2V1cHxlbnwxfHx8fDE3NTgzNzgyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Base Makeup",
    readTime: "12 min",
    difficulty: "Beginner",
    likes: 276
  },
  {
    id: 4,
    title: "Blush & Highlight Placement Guide",
    description: "Find your perfect blush and highlight placement for your face shape. Create a natural, glowing complexion with these pro tips.",
    image: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVzaCUyMGhpZ2hsaWdodGluZyUyMG1ha2V1cHxlbnwxfHx8fDE3NTgzNzgyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Face Makeup",
    readTime: "6 min",
    difficulty: "Beginner",
    likes: 155
  }
]

// Generate more mock data to reach 50+ items
const generateMockTips = (): MakeupTip[] => {
  const baseCategories = ["Eye Makeup", "Lip Makeup", "Base Makeup", "Face Makeup", "Brow Makeup"]
  const difficulties: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced']
  const images = [
    "https://images.unsplash.com/photo-1585049303349-6680e6179692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjB0dXRvcmlhbCUyMGJlYXV0eSUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgzNzgyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1663693608907-e512a86606bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXBzdGljayUyMG1ha2V1cCUyMGFwcGxpY2F0aW9ufGVufDF8fHx8MTc1ODM3ODIxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1645017324561-5de0e0739ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3VuZGF0aW9uJTIwY29udG91cmluZyUyMG1ha2V1cHxlbnwxfHx8fDE3NTgzNzgyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVzaCUyMGhpZ2hsaWdodGluZyUyMG1ha2V1cHxlbnwxfHx8fDE3NTgzNzgyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ]

  const tipTitles = [
    "Winged Eyeliner Mastery", "Natural Glam Look", "Bold Lip Colors", "Everyday Makeup Routine",
    "Special Occasion Makeup", "Color Correcting Tips", "Eyebrow Shaping Guide", "Skin Prep Essentials",
    "Makeup for Different Skin Tones", "Quick 5-Minute Makeup", "Waterproof Makeup Techniques",
    "Vintage Makeup Looks", "Editorial Makeup Trends", "Seasonal Color Palettes", "Makeup Tool Guide",
    "Setting Spray Secrets", "Concealer Application", "Lip Liner Techniques", "False Lash Application",
    "Makeup for Photography", "Travel Makeup Kit", "Drugstore vs High-End", "Makeup Removal Tips",
    "Sensitive Skin Makeup", "Mature Skin Techniques", "Teenage Makeup Guide", "Wedding Makeup Ideas",
    "Party Makeup Looks", "Office-Appropriate Makeup", "Summer Makeup Tips", "Winter Skincare & Makeup",
    "Korean Beauty Trends", "Highlighter Placement", "Bronzer Application", "Eye Primer Importance",
    "Makeup Brush Care", "Color Theory in Makeup", "Face Shape Contouring", "Eye Shape Enhancement",
    "Lip Shape Correction", "Makeup for Glasses", "Long-Wear Formulas", "Makeup Allergies Guide",
    "Professional Makeup Tips", "Makeup Storage Ideas", "Trend vs Classic", "Makeup Mistakes to Avoid"
  ]

  const allTips = [...mockMakeupTips]
  
  for (let i = 5; i <= 50; i++) {
    allTips.push({
      id: i,
      title: tipTitles[(i - 5) % tipTitles.length],
      description: `Professional makeup tutorial covering essential techniques and expert tips. Learn step-by-step methods for achieving beautiful, long-lasting results with detailed guidance and insider secrets.`,
      image: images[(i - 1) % images.length],
      category: baseCategories[(i - 1) % baseCategories.length],
      readTime: `${3 + ((i * 7) % 15)} min`,
      difficulty: difficulties[(i * 3) % difficulties.length],
      likes: 50 + ((i * 73) % 500)
    })
  }
  
  return allTips
}

const allMakeupTips = generateMockTips()

export function MakeupTips() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const totalPages = Math.ceil(allMakeupTips.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTips = allMakeupTips.slice(startIndex, endIndex)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 hover:bg-red-200'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="max-w-6xl mx-auto px-4 py-12 ">
          <h1 className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Makeup Tips
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Learn practical techniques and product advice to elevate your makeup game.
          </p>
        </div>
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
                    <ImageWithFallback
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover md:rounded-none md:rounded-l-lg"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 px-6 pt-6 pb-0 flex flex-col justify-between">
                    <div>
                      {/* Category and difficulty badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                          {tip.category}
                        </Badge>
                        <Badge className={getDifficultyColor(tip.difficulty)}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-medium mb-3 text-foreground hover:text-primary cursor-pointer transition-colors">
                        {tip.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {tip.description}
                      </p>
                    </div>
                    
                    {/* Meta and CTA */}
                    <div className="flex items-center justify-between pb-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tip.readTime}</span>
                        </div>
                        
                      </div>
                      
                      <Button 
                        asChild
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        <Link href="/makeup_tips_detail">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Tutorial
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination (match discover_makeup style) */}
        {totalPages > 1 && (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                .reduce<number[]>((acc, page) => {
                  if (acc.length === 0 || acc[acc.length - 1] + 1 === page) acc.push(page);
                  else acc.push(NaN, page); // NaN as ellipsis marker
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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

export default function Page() {
  return <MakeupTips />
}