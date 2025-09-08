import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using AI Makeup Insight.",
  openGraph: {
    title: "Terms & Conditions | AI Makeup Insight",
    description: "The terms for using AI Makeup Insight.",
    url: absoluteUrl("/terms"),
    images: [{ url: "/api/og?title=Terms%20%26%20Conditions", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | AI Makeup Insight",
    description: "The terms for using AI Makeup Insight.",
    images: ["/api/og?title=Terms%20%26%20Conditions"],
  },
};

export default function TermsPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Please review the terms for using our services.
      </p>
    </main>
  );
}


