import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Discover Makeup",
  description: "Explore trending looks and community-shared inspirations.",
  openGraph: {
    title: "Discover Makeup | AI Makeup Insight",
    description: "Explore trending looks and community-shared inspirations.",
    url: absoluteUrl("/discover_makeup"),
    images: [{ url: "/api/og?title=Discover%20Makeup", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Makeup | AI Makeup Insight",
    description: "Explore trending looks and community-shared inspirations.",
    images: ["/api/og?title=Discover%20Makeup"],
  },
};

export default function DiscoverMakeupPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Discover Makeup</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Browse curated looks, tips, and community favorites to inspire your next style.
      </p>
    </main>
  );
}


