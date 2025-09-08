import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans to start your personalized AI makeup analysis.",
  openGraph: {
    title: "Pricing | AI Makeup Insight",
    description: "Simple plans to start your personalized AI makeup analysis.",
    url: absoluteUrl("/pricing"),
    images: [{ url: "/api/og?title=Pricing", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | AI Makeup Insight",
    description: "Simple plans to start your personalized AI makeup analysis.",
    images: ["/api/og?title=Pricing"],
  },
};

export default function PricingPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pricing</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Choose a plan that fits you. Cancel anytime.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["Starter", "Pro", "Premium"].map((tier) => (
          <div key={tier} className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{tier}</h2>
            <p className="text-sm text-gray-600 mt-1">Great for personal beauty routines.</p>
            <a href="/upload" className="btn-primary mt-6 inline-flex">Get started</a>
          </div>
        ))}
      </div>
    </main>
  );
}


