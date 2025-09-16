import { ImageWithFallback } from './ImageWithFallback'

interface ImagePlaceholderProps {
  width?: number
  height?: number
  className?: string
}

export function ImagePlaceholder({ 
  width = 244, 
  height = 244, 
  className = "" 
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Background image with low opacity */}
      <ImageWithFallback 
        src="https://images.unsplash.com/photo-1749630699891-eb25c3426d90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ3JheSUyMGJhY2tncm91bmQlMjB0ZXh0dXJlfGVufDF8fHx8MTc1Nzk0MzM1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Loading background"
        className="w-full h-full object-cover opacity-20"
      />
      
      {/* Overlay with processing message */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
        <div className="text-center space-y-3">
          {/* Loading spinner */}
          <div className="mx-auto w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          
          {/* Processing text */}
          <div className="space-y-1">
            <p className="text-gray-500 font-medium">Processing</p>
            <p className="text-gray-400 text-sm">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Alternative version with just gray background (no image)
export function SimpleImagePlaceholder({ 
  width = 244, 
  height = 244, 
  className = "" 
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-center space-y-3">
        {/* Loading spinner */}
        <div className="mx-auto w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        
        {/* Processing text */}
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Processing</p>
          <p className="text-gray-400 text-sm">Please wait...</p>
        </div>
      </div>
    </div>
  )
}