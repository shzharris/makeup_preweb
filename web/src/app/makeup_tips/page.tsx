import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Makeup Tips",
  description: "Practical advice to refine your routine and enhance results.",
  openGraph: {
    title: "Makeup Tips | AI Makeup Insight",
    description: "Practical advice to refine your routine and enhance results.",
    url: absoluteUrl("/makeup_tips"),
    images: [{ url: "/api/og?title=Makeup%20Tips", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Makeup Tips | AI Makeup Insight",
    description: "Practical advice to refine your routine and enhance results.",
    images: ["/api/og?title=Makeup%20Tips"],
  },
};

export default function MakeupTipsPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Makeup Tips</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Learn practical techniques and product advice to elevate your makeup game.
      </p>
    </main>
  );
}


