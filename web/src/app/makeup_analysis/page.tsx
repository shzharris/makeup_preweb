"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { useSession, signIn } from "next-auth/react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { SimpleImagePlaceholder } from '../../components/figma/imagePlaceholder'

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

function ImageProcessor() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl: "/makeup_analysis" });
    }
  }, [status]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const PAGE_SIZE = 12;
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subModalMsg, setSubModalMsg] = useState<string>("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState("");
  const [viewerAlt, setViewerAlt] = useState("");
  const [analyzeErrorOpen, setAnalyzeErrorOpen] = useState(false);

  const mapReasonToMessage = (reason?: string) => {
    switch (reason) {
      case 'no_subscription':
        return "You don't have an active plan yet. AI processing incurs costs. Please subscribe first. Thank you!";
      case 'cancelled':
        return 'Your subscription has been canceled. Please subscribe again to continue.';
      case 'settled':
        return 'Your pay-per-use quota is used up. Please renew or switch to another plan.';
      case 'out_of_window':
        return "Your plan isn't active right now. Please try during the valid time window or adjust your plan.";
      case 'unknown_type':
        return 'Unrecognized subscription type. Please check your plan or contact support.';
      case 'unauthorized':
        return 'You are not signed in or your session expired. Please sign in again.';
      default:
        return 'Subscription check failed. Please subscribe before using AI processing.';
    }
  };

  useEffect(() => {
    let aborted = false;
    const loadInitial = async () => {
      if (status !== "authenticated") return;
      setLoading(true);
      try {
        const res = await fetch(`/api/user/photos?limit=${PAGE_SIZE}&offset=0`);
        if (!res.ok) return;
        const data = await res.json();
        if (aborted) return;
        const items = (data.items ?? []) as Array<{
          id: string; originalUrl: string; processedUrl: string; processedAt: string; status: string;
        }>;
        const mapped = items.map(i => ({
          id: i.id,
          originalUrl: i.originalUrl,
          processedUrl: i.processedUrl,
          processedAt: i.processedAt,
          status: (i.status as 'completed' | 'processing' | 'failed') ?? 'completed',
        }));
        setProcessedImages(mapped);
        setOffset(items.length);
        setHasMore(items.length === PAGE_SIZE);
      } catch {}
      finally {
        if (!aborted) setLoading(false);
      }
    };
    // reset when auth ready
    if (status === "authenticated") {
      setProcessedImages([]);
      setOffset(0);
      setHasMore(true);
      loadInitial();
    }
    return () => { aborted = true; };
  }, [status]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/photos?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!res.ok) return;
      const data = await res.json();
      const items = (data.items ?? []) as Array<{
        id: string; originalUrl: string; processedUrl: string; processedAt: string; status: string;
      }>;
      const mapped = items.map(i => ({
        id: i.id,
        originalUrl: i.originalUrl,
        processedUrl: i.processedUrl,
        processedAt: i.processedAt,
        status: (i.status as 'completed' | 'processing' | 'failed') ?? 'completed',
      }));
      setProcessedImages(prev => [...prev, ...mapped]);
      setOffset(prev => prev + items.length);
      setHasMore(items.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowResult(false);
    setProcessedResult("");
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setShowResult(false);
    try {
      // 0) Check subscription status
      const subRes = await fetch('/api/subscription/status');
      if (!subRes.ok) throw new Error('Unauthorized or subscription check failed');
      const subJson = await subRes.json();
      if (!subJson.ok) {
        setSubModalMsg(mapReasonToMessage(subJson.reason));
        setSubModalOpen(true);
        return;
      }

      // 1) Request a signed upload URL for R2
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: selectedFile.name, contentType: selectedFile.type, is_public: allowPublicDisplay }),
      });
      if (!signRes.ok) throw new Error("Failed to sign upload");
      const { uploadUrl, headers, publicUrl, is_public } = await signRes.json();

      // 2) Try direct upload to R2
      let uploaded = false;
      try {
        const putRes = await fetch(uploadUrl, { method: "PUT", headers, body: selectedFile });
        uploaded = putRes.ok;
      } catch {
        uploaded = false;
      }

      // 2b) Fallback to proxy when direct upload fails (CORS or other)
      if (!uploaded) {
        const fd = new FormData();
        fd.append("uploadUrl", uploadUrl);
        fd.append("file", selectedFile);
        const proxyRes = await fetch("/api/uploads/proxy", { method: "POST", body: fd });
        if (!proxyRes.ok) throw new Error("Proxy upload failed");
      }

      // 3) Insert DB record and get photo id
      const dbRes = await fetch("/api/user/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: publicUrl, isPublic: !!is_public }),
      });
      if (!dbRes.ok) throw new Error("Failed to insert photo record");
      const { id: photoId } = await dbRes.json();

      // 3b) Trigger server-side AI processing (Gemini) synchronously and wait for result
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, originalUrl: publicUrl, contentType: selectedFile.type }),
      });
      let analyzeJson: unknown = null;
      try {
        analyzeJson = await analyzeRes.json();
      } catch {}

      const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
      const errorText = isRecord(analyzeJson) && typeof analyzeJson.error === 'string' ? (analyzeJson.error as string) : '';
      const hasApiError = !analyzeRes.ok || (typeof errorText === 'string' && errorText.trim().length > 0);
      if (hasApiError) {
        setAnalyzeErrorOpen(true);
        return;
      }
      const processedUrlFromAI: string = (isRecord(analyzeJson) && typeof analyzeJson.processedUrl === 'string') ? (analyzeJson.processedUrl as string) : "";

      // 4) Write usage log with real photo id
      fetch("/api/usage-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload", action_data_id: photoId }),
      }).catch(() => {});

      // 5) Update UI with processed result
      setProcessedResult(processedUrlFromAI || publicUrl);
      setShowResult(true);
      setProcessedImages(prev => {
        const exists = prev.find(p => p.id === photoId);
        const item = {
          id: photoId,
          originalUrl: publicUrl,
          processedUrl: processedUrlFromAI || "",
          processedAt: new Date().toISOString(),
          status: 'completed' as const,
        };
        if (exists) {
          return prev.map(p => p.id === photoId ? item : p);
        }
        return [item, ...prev];
      });
    } catch (err) {
      console.error("[upload]", err);
      setAnalyzeErrorOpen(true);
    } finally {
      setIsProcessing(false);
    }
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

  const handleDownload = async () => {
    if (!processedResult) return;
    try {
      const api = `/api/download?url=${encodeURIComponent(processedResult)}`;
      const res = await fetch(api);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const name = (processedResult.split('/').pop() || 'makeup-insight.png').split('?')[0];
      a.href = url;
      a.download = name || 'makeup-insight.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Main Processing Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Makeup Insight AI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Let AI analyze your makeup today and get the insights results in a moment. 
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
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
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
                    alt="Makeup Insight Result"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-rose-500 text-white">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      Makeup Insight
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 bg-gradient-to-r from-rose-100 to-pink-100"
                  onClick={handleDownload}
                  disabled={!processedResult}
                >
                  💾 Download Your Makeup Insight Result
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
              My Makeup Record
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
              <div
                className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 border-2 border-pink-100 relative cursor-zoom-in"
                onClick={() => {
                  if (!image.processedUrl) return;
                  setViewerSrc(image.processedUrl);
                  setViewerAlt('makeup insight result');
                  setViewerOpen(true);
                }}
              >
              {image.processedUrl ? (
                <ImageWithFallback
                src={image.processedUrl}
                alt="makeup insight result"
                className="w-full h-full object-contain"
              />
              ) : (
                <SimpleImagePlaceholder className="w-full h-full" />
              )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-pink-600">
                  <span className="text-center">{image.processedAt}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {hasMore && (
            <Button onClick={loadMore} disabled={loading} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              {loading ? "Loading..." : "Load More"}
            </Button>
          )}
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

      {/* Subscription Modal */}
      {subModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSubModalOpen(false)} />
          <div className="relative w-full max-w-md mx-auto rounded-2xl p-6 shadow-xl bg-white border border-pink-200">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="w-5 h-5 text-pink-500" />
              <h4 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Subscription Tip</h4>
            </div>
            <p className="text-sm text-pink-800 mb-4">{subModalMsg}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50" onClick={() => setSubModalOpen(false)}>Later</Button>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white" onClick={() => { setSubModalOpen(false); window.location.href = '/?#pricing'; }}>Go to Subscription</Button>
            </div>
          </div>
        </div>
      )}

      {/* Analyze Error Modal */}
      {analyzeErrorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAnalyzeErrorOpen(false)} />
          <div className="relative w-full max-w-md mx-auto rounded-2xl p-6 shadow-xl bg-white border border-pink-200">
            <div className="mb-3">
              <h4 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Notice</h4>
            </div>
            <div className="space-y-2 text-sm text-pink-800">
              <p>1. Please upload a valid face photo.</p>
              <p>2. The system is busy. Please try again later.</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white" onClick={() => setAnalyzeErrorOpen(false)}>Got it</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <ImageProcessor />;
}