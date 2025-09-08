import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data.",
  openGraph: {
    title: "Privacy Policy | AI Makeup Insight",
    description: "How we collect, use, and protect your data.",
    url: absoluteUrl("/privacy"),
    images: [{ url: "/api/og?title=Privacy%20Policy", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | AI Makeup Insight",
    description: "How we collect, use, and protect your data.",
    images: ["/api/og?title=Privacy%20Policy"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="container-pad py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        We care about your privacy. Non-public photos are protected by signed URLs and strict access control.
      </p>
    </main>
  );
}


