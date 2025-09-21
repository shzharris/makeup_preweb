"use client";
import { ImageWithFallback } from '../../components/figma/ImageWithFallback'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { ArrowLeft, Clock, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

interface MakeupTipDetailProps {
  tip: MakeupTip
  onBack: () => void
}

export function MakeupTipDetail({ tip, onBack }: MakeupTipDetailProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 hover:bg-red-200'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  // Generate tutorial content based on the tip
  const generateTutorialContent = (title: string) => {
    const contentMap = {
      "Perfect Smoky Eye Tutorial": `
        Creating the perfect smoky eye is an art that requires the right technique and tools. This timeless look can be adapted for any occasion, from subtle daytime elegance to dramatic evening glamour.

        **Getting Started**
        Begin with a quality eyeshadow primer to ensure your makeup stays vibrant and crease-free throughout the day. This step is crucial for achieving professional-looking results.

        **The Base**
        Start by applying a neutral base color across your entire eyelid, from the lash line to just below the brow bone. This creates an even canvas and helps with blending later colors.

        **Building Depth**
        Use a medium-toned brown shade in your crease, blending it upward and outward in windshield wiper motions. This creates natural-looking depth and dimension.

        **The Drama**
        Apply your darkest shade along the lash line and in the outer V of your eye. Build up the color gradually, blending as you go to avoid harsh lines.

        **Finishing Touches**
        Line your eyes with black eyeliner, making it slightly thicker toward the outer corner. Complete the look with 2-3 coats of volumizing mascara, focusing on separating each lash.

        **Pro Tips**
        - Use a flat shader brush for packing on color
        - A fluffy blending brush is essential for seamless transitions
        - Build color gradually - you can always add more
        - Don't forget to blend the lower lash line for a cohesive look
      `,
      "Long-Lasting Lipstick Application": `
        Achieving long-lasting lipstick that stays put all day requires proper preparation and application technique. With the right approach, you can enjoy beautiful lips that last through meals and conversations.

        **Preparation is Key**
        Start with smooth, exfoliated lips. Use a gentle lip scrub to remove any dry skin, then apply a light moisturizer and let it absorb completely.

        **Creating the Perfect Base**
        Apply a lip primer or use concealer around the lip line to create a smooth, even base. This helps the lipstick adhere better and prevents feathering.

        **The Foundation**
        Line your lips with a lip liner that matches your lipstick shade. Fill in the entire lip area with the liner - this creates a base that helps your lipstick last longer.

        **Lipstick Application**
        Apply your lipstick with a lip brush for precision and even coverage. Start from the center of your lips and work outward, building up the color in thin layers.

        **Setting the Color**
        Blot your lips with a tissue, then apply a second layer of lipstick. For extra staying power, dust a small amount of translucent powder over tissue placed on your lips.

        **Final Details**
        Clean up any imperfections with concealer on a small brush, and add a touch of gloss to the center of your lips if desired for dimension.
      `,
      "Foundation & Contouring Basics": `
        Perfect foundation and contouring can transform your complexion, creating a flawless base that enhances your natural beauty. Mastering these basics is essential for any makeup look.

        **Skin Preparation**
        Start with clean, moisturized skin. Apply a primer that suits your skin type - hydrating for dry skin, mattifying for oily skin, or color-correcting for specific concerns.

        **Foundation Selection**
        Choose a foundation that matches your neck and jawline perfectly. Test shades in natural light when possible, and consider your undertones - warm, cool, or neutral.

        **Application Technique**
        Apply foundation with a damp beauty sponge or brush, working from the center of your face outward. Build coverage gradually, focusing on areas that need more attention.

        **Concealer Magic**
        Use concealer that's one shade lighter than your foundation for under-eye brightening and blemish coverage. Blend carefully to avoid obvious patches.

        **Contouring Basics**
        Apply contour shade in the hollows of your cheeks, along your temples, and under your jawline. The key is to enhance your natural bone structure, not create artificial shadows.

        **Blending is Everything**
        Blend your contour thoroughly with a clean brush or sponge. The goal is subtle definition that looks natural, not obvious lines.

        **Setting Your Work**
        Finish with a light dusting of setting powder to lock everything in place and reduce shine throughout the day.
      `
    }
    
    return contentMap[title as keyof typeof contentMap] || `
      This comprehensive makeup tutorial will guide you through professional techniques and insider tips to achieve stunning results.

      **Getting Started**
      Proper preparation is the foundation of any great makeup look. Ensure your skin is clean and moisturized before beginning any makeup application.

      **Professional Techniques**
      Learn step-by-step methods that professional makeup artists use to create flawless looks. These techniques have been perfected through years of experience in the beauty industry.

      **Quality Tools Matter**
      Invest in good quality brushes and tools. The right equipment can make a significant difference in the final result and application process.

      **Building Your Skills**
      Practice these techniques regularly to build your confidence and skill level. Start with lighter application and gradually build up intensity as you become more comfortable.

      **Finishing Touches**
      Complete your look with appropriate setting products to ensure your makeup lasts throughout the day and maintains its fresh appearance.

      Remember, makeup is an art form that allows for creativity and self-expression. Don't be afraid to experiment and find what works best for your unique features and style.
    `
  }

  const content = generateTutorialContent(tip.title)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r  border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tips
          </Button>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
              {tip.category}
            </Badge>
            <Badge className={getDifficultyColor(tip.difficulty)}>
              {tip.difficulty}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {tip.title}
          </h1>
          
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{tip.readTime}</span>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 bg-white/50">
            <p className="text-sm italic text-muted-foreground text-left">
              {tip.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Image */}
        <div className="flex justify-center mb-8">
          <div className="aspect-[4/3] max-w-2xl overflow-hidden rounded-lg">
            <ImageWithFallback
              src={tip.image}
              alt={tip.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div className="whitespace-pre-line text-foreground leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const router = useRouter();
  // 默认示例数据（可后续改为根据路由/查询参数加载）
  const tip: MakeupTip = {
    id: 1,
    title: "Perfect Smoky Eye Tutorial",
    description: "Master the art of creating sultry, dramatic smoky eyes that work for any occasion. Learn professional blending techniques and color selection.",
    image: "https://images.unsplash.com/photo-1585049303349-6680e6179692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Eye Makeup",
    readTime: "8 min",
    difficulty: "Intermediate",
    likes: 324,
  };

  return (
    <MakeupTipDetail tip={tip} onBack={() => router.push('/makeup_tips')} />
  );
}