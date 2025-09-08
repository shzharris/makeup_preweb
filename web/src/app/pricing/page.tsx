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
      <p className="mt-3 text-gray-600 max-w-prose">Choose a plan that fits you. Cancel anytime.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* One-time */}
        <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold">One-time</h2>
          <p className="text-sm text-gray-600 mt-1">Pay once. Use once.</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">$0.99</span>
            <span className="text-sm text-gray-500">/ per use</span>
          </div>
          <a href="/pricing/subscribe?plan=one-time" className="btn-primary mt-6 inline-flex">Purchase</a>
        </div>

        {/* Monthly (Most popular) */}
        <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm relative flex flex-col">
          <span className="absolute -top-3 left-4 rounded-full bg-[--brand-100] text-[--color-brand-600] text-xs px-3 py-1 border border-[--brand-200]">Most popular</span>
          <h2 className="text-lg font-semibold">Monthly</h2>
          <p className="text-sm text-gray-600 mt-1">Unlimited access for 1 month.</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">$9.99</span>
            <span className="text-sm text-gray-500">/ month</span>
          </div>
          <a href="/pricing/subscribe?plan=monthly" className="btn-primary mt-6 inline-flex">Subscribe</a>
        </div>

        {/* 6 Months */}
        <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold">6 Months</h2>
          <p className="text-sm text-gray-600 mt-1">Best value for half-year access.</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">$49.99</span>
            <span className="text-sm text-gray-500">/ 6 months</span>
          </div>
          <a href="/pricing/subscribe?plan=half-year" className="btn-primary mt-6 inline-flex">Subscribe</a>
        </div>
      </div>
    </main>
  );
}


