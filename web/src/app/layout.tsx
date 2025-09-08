import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Makeup Insight | Personalized Makeup Analysis",
    template: "%s | AI Makeup Insight",
  },
  description: "Upload a selfie to detect makeup issues and get personalized suggestions. Mobile-friendly, privacy-first, and community-powered.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Makeup Insight",
    description: "Personalized AI makeup analysis with mobile-ready uploads and community gallery.",
    url: siteUrl + "/",
    siteName: "AI Makeup Insight",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "AI Makeup Insight" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Makeup Insight",
    description: "Personalized AI makeup analysis with mobile-ready uploads and community gallery.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AI Makeup Insight',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: siteUrl + '/search?q={query}',
                'query-input': 'required name=query',
              },
            }),
          }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
