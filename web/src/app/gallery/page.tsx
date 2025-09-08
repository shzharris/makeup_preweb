import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore public makeup results shared by the community.",
  openGraph: {
    title: "Gallery | AI Makeup Insight",
    description: "Explore public makeup results shared by the community.",
    url: absoluteUrl("/gallery"),
    images: [{ url: "/api/og?title=Gallery", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | AI Makeup Insight",
    description: "Explore public makeup results shared by the community.",
    images: ["/api/og?title=Gallery"],
  },
};

export default function GalleryPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Gallery</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        See what others are creating, discover looks, and get inspired.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl border border-black/5 bg-[--brand-50]" />
        ))}
      </div>
    </main>
  );
}


