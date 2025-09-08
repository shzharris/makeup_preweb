import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Makeup Analysis",
  description: "Analyze your makeup with AI-powered insights and suggestions.",
  openGraph: {
    title: "Makeup Analysis | AI Makeup Insight",
    description: "Analyze your makeup with AI-powered insights and suggestions.",
    url: absoluteUrl("/makeup_analysis"),
    images: [{ url: "/api/og?title=Makeup%20Analysis", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Makeup Analysis | AI Makeup Insight",
    description: "Analyze your makeup with AI-powered insights and suggestions.",
    images: ["/api/og?title=Makeup%20Analysis"],
  },
};

export default function MakeupAnalysisPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Makeup Analysis</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Learn how our AI identifies smudges, shade mismatches, and offers fix suggestions tailored to your look.
      </p>
    </main>
  );
}


