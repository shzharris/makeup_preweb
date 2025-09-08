import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload a selfie for AI makeup analysis. Mobile-friendly camera supported.",
  openGraph: {
    title: "Upload | AI Makeup Insight",
    description: "Upload a selfie for AI makeup analysis. Mobile-friendly camera supported.",
    url: absoluteUrl("/upload"),
    images: [{ url: "/api/og?title=Upload", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload | AI Makeup Insight",
    description: "Upload a selfie for AI makeup analysis. Mobile-friendly camera supported.",
    images: ["/api/og?title=Upload"],
  },
};

export default function UploadPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Upload</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Take a photo or upload from your library. You can choose to share it publicly in the gallery.
      </p>
      <div className="mt-8 rounded-xl border border-black/5 bg-white p-6 shadow-sm text-sm text-gray-600">
        Upload form coming soon.
      </div>
    </main>
  );
}


