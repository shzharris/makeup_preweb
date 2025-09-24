import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

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
    default: "Makeup Insight AI | Personalized Makeup Analysis",
    template: "%s | Makeup Insight AI",
  },
  keywords: ["makeup analysis ai", "makeup detection ai", "makeup insights ai", "makeup tips ai"],
  description: "Upload a selfie to detect makeup flaws and receive personalized recommendations. We offer makeup analysis, makeup detection, makeup insights, and more. Just one photo of your makeup needs to be analyzed flawlessly by AI.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Makeup Insight AI",
    description: "Personalized AI makeup analysis with mobile-ready uploads and community gallery.",
    url: siteUrl + "/",
    siteName: "Makeup Insight AI",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Makeup Insight AI" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Makeup Insight AI",
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <Script
          id="adsbygoogle-init"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4704956339474632"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Makeup Insight AI',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: siteUrl + '/search?q={query}',
                'query-input': 'required name=query',
              },
            }),
          }}
        />
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
