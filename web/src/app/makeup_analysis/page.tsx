"use client";
import { useState, useRef, useCallback } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { 
  UploadIcon, 
  ArrowRightIcon,
  CheckCircleIcon, 
  ImageIcon,
  SparklesIcon,
  StarsIcon,
  EyeIcon
} from "lucide-react";

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  processedAt: string;
  status: 'completed' | 'processing' | 'failed';
}

export function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock processed images history
  const [processedImages] = useState<ProcessedImage[]>([
    {
      id: "1",
      originalUrl: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 14:30",
      status: 'completed'
    },
    {
      id: "2", 
      originalUrl: "https://images.unsplash.com/photo-1590393802710-dbf451560939?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1590393802710-dbf451560939?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 13:45",
      status: 'completed'
    },
    {
      id: "3",
      originalUrl: "https://images.unsplash.com/photo-1594646996739-9ea802039fe3?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1594646996739-9ea802039fe3?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 12:20",
      status: 'completed'
    },
    {
      id: "4",
      originalUrl: "https://images.unsplash.com/photo-1623601903065-0d5b4ae594d4?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1623601903065-0d5b4ae594d4?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-15 11:15",
      status: 'completed'
    },
    {
      id: "5",
      originalUrl: "https://images.unsplash.com/photo-1605813809066-0773a4e7e50e?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1605813809066-0773a4e7e50e?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 16:30",
      status: 'completed'
    },
    {
      id: "6",
      originalUrl: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?w=300&h=300&fit=crop",
      processedUrl: "https://images.unsplash.com/photo-1605474082506-21d31d9d95e8?w=300&h=300&fit=crop&saturation=1.5&contrast=1.2",
      processedAt: "2024-01-14 15:45",
      status: 'completed'
    }
  ]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowResult(false);
      setProcessedResult("");
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setShowResult(false);

    // Simulate processing time
    setTimeout(() => {
      // Mock processed result - in real app this would come from your API
      setProcessedResult(previewUrl + "&saturation=2&contrast=1.2");
      setIsProcessing(false);
      setShowResult(true);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setProcessedResult("");
    setShowResult(false);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Main Processing Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Makeup Analysis AI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Let AI analyze your makeup today and get the analysis results in a moment. 
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Section */}

          <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <div className="text-center mb-4">
              <h3 className="text-lg mb-2 text-pink-800">Upload Your Makeup Photo</h3>
            </div>
            
            {!selectedFile ? (
              <div
                onClick={handleUploadClick}
                className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center cursor-pointer hover:border-pink-500 transition-colors bg-white/50"
              >
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-pink-500" />
                <p className="text-pink-700 mb-2">Click to upload your makeup photo</p>
                <p className="text-xs text-pink-600">Best results with selfies & portraits</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-pink-200">
                  <ImageWithFallback
                    src={previewUrl}
                    alt="Selected makeup photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleProcess} 
                      disabled={isProcessing} 
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    >
                      {isProcessing ? "✨ Insighting..." : "✨ Start Insight"}
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="border-pink-300 text-pink-700 hover:bg-pink-50">
                      Reset
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg border border-pink-200">
                    <Checkbox 
                      id="public-display"
                      checked={allowPublicDisplay}
                      onCheckedChange={(checked) => setAllowPublicDisplay(checked === true)}
                      className="border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                    />
                    <label 
                      htmlFor="public-display" 
                      className="text-sm text-pink-800 cursor-pointer flex items-center gap-1"
                    >
                      <EyeIcon className="w-3 h-3" />
                      I agree to display my makeup photo publicly
                    </label>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </Card>

          {/* Processing Status */}
          <div className="flex items-center justify-center h-80">
            {!selectedFile && (
              <ArrowRightIcon className="w-20 h-20 text-purple-400 fill-none stroke-2" />
            )}

            {selectedFile && !isProcessing && !showResult && (
              <ArrowRightIcon className="w-20 h-20 text-purple-500 animate-pulse fill-none stroke-2" />
            )}

            {isProcessing && (
              <ArrowRightIcon className="w-20 h-20 animate-bounce text-pink-500 fill-none stroke-2" />
            )}

            {showResult && (
              <CheckCircleIcon className="w-20 h-20 text-green-500 fill-none stroke-2" />
            )}
          </div>

          {/* Result Section */}
          <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
            <div className="text-center mb-4">
              <h3 className="text-lg mb-2 text-rose-800">Makeup Insight Result</h3>
            </div>

            {!showResult && !isProcessing && (
              <div className="border-2 border-dashed border-rose-300 rounded-lg p-8 text-center aspect-square flex items-center justify-center bg-white/50">
                <div className="text-rose-600">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                  <p>Your Makeup Insight Result</p>
                  <p className="text-sm text-rose-500 mt-1">will appear here ✨</p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="border-2 border-dashed border-rose-300 rounded-lg p-8 text-center aspect-square flex items-center justify-center bg-white/50">
                <div className="text-rose-600">
                  <div className="relative">
                    <SparklesIcon className="w-8 h-8 mx-auto mb-4 animate-pulse text-rose-500" />
                    <div className="absolute -top-1 -right-1">
                      <StarsIcon className="w-3 h-3 text-pink-400 animate-bounce" />
                    </div>
                  </div>
                  <p>Creating magic...</p>
                </div>
              </div>
            )}

            {showResult && processedResult && (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-rose-300 relative">
                  <ImageWithFallback
                    src={processedResult}
                    alt="Enhanced beauty result"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-rose-500 text-white">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      Enhanced
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 bg-gradient-to-r from-rose-100 to-pink-100"
                >
                  💾 Download Your Enhanced Photo
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* My Beauty Gallery Section */}
      <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-3xl p-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              My Makeup Gallery
            </h2>
            <SparklesIcon className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-muted-foreground">
            ✨ Your private makeup photo history processing record ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedImages.map((image) => (
            <Card 
              key={image.id} 
              className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-pink-200 hover:border-pink-300"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 border-2 border-pink-100 relative">
                <ImageWithFallback
                  src={image.processedUrl}
                  alt="Enhanced beauty photo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-pink-600">
                  <span className="text-center">{image.processedAt}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {processedImages.length === 0 && (
          <div className="text-center py-16 text-pink-600">
            <div className="relative inline-block">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <SparklesIcon className="w-6 h-6 absolute -top-1 -right-1 text-pink-400 animate-pulse" />
            </div>
            <p className="text-lg">No Makeup Insight Result yet</p>
            <p className="text-sm text-pink-500 mt-2">Upload your first makeup photo to use Makeup Insight AI ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <ImageProcessor />;
}