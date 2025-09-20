import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data.",
  openGraph: {
    title: "Privacy Policy | Makeup Insight AI",
    description: "How we collect, use, and protect your data.",
    url: absoluteUrl("/privacy"),
    images: [{ url: "/api/og?title=Privacy%20Policy", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Makeup Insight AI",
    description: "How we collect, use, and protect your data.",
    images: ["/api/og?title=Privacy%20Policy"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="section-soft section-pad">
      <div className="container-pad">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-2">black flame DIGITAL Service Company Ltd. Updated: September 12, 2025</p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur p-6 shadow-sm text-gray-700 leading-relaxed">
          <h2 className="text-xl font-semibold text-pink-800">Privacy Policy for MakeupInsight.us</h2>
          <p className="mt-2">Welcome to MakeupInsight.us, an AI-powered makeup analysis tool. This Privacy Policy explains what data we collect, how we use it, how we protect it, and the choices you have.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">1. Who We Are</h2>
          <p>MakeupInsight.us (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides AI-driven insights for users who upload makeup photos. Our service includes optional public sharing to inspire the community.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">2. Information We Collect</h2>
          <p><strong>a. Account &amp; Authentication</strong>: If you sign in with Google, we receive basic profile information (name, email, avatar) and session identifiers.</p>
          <p><strong>b. Payments</strong>: If you subscribe or purchase one-time usage, our payment processor (Stripe) collects and processes your payment details. We receive limited billing metadata (e.g., status, plan, last4) but not full card numbers.</p>
          <p><strong>c. Content You Provide</strong>: Photos you upload for analysis, your analysis options (e.g., public display toggle), and any captions or settings related to your upload.</p>
          <p><strong>d. Derived Results</strong>: AI-generated analysis and any processed images or overlays created from your upload.</p>
          <p><strong>e. Usage &amp; Device Data</strong>: Logs for security, performance, and analytics (e.g., IP address, device type, timestamps, request paths, error diagnostics, cookies).</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">3. How We Use Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, maintain, and improve the AI makeup analysis experience.</li>
            <li>Process transactions, manage subscriptions, and provide receipts.</li>
            <li>Show analysis results and, only if you opt in, display your photo in the public gallery.</li>
            <li>Secure our services, prevent abuse, and troubleshoot issues.</li>
            <li>Comply with legal obligations and enforce terms.</li>
          </ul>
          <p className="mt-2">Unless you give explicit consent, we do not use your uploaded photos to train machine learning models.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">4. Sharing &amp; Disclosure</h2>
          <p>We share data with trusted processors strictly to operate the service:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google</strong>: Sign-in (OAuth), AI processing (Google GenAI), infrastructure (Google Cloud Storage).</li>
            <li><strong>Vercel</strong>: Hosting and edge runtime.</li>
            <li><strong>Stripe</strong>: Payments and subscription management.</li>
            <li><strong>Database/Storage</strong>: Managed Postgres/Supabase or equivalent, and object storage (e.g., GCS) for images.</li>
          </ul>
          <p className="mt-2">We do not sell your personal information. Public display happens only if you enable the &quot;public&quot; option for a specific upload. You may revoke this later to remove it from the gallery.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">5. Data Retention</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Uploaded photos &amp; processed images: retained as long as your account exists or until you delete them.</li>
            <li>Analysis results and logs: typically retained up to 180 days for security and product improvements.</li>
            <li>Payment records: retained as required for accounting, tax, and legal compliance.</li>
          </ul>
          <p className="mt-2">You can request deletion of your content. Upon deletion, we remove files from primary storage and issue CDN/cache purges where applicable.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">6. Your Choices &amp; Rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Access/Export</strong>: Request a copy of your personal data.</li>
            <li><strong>Correction</strong>: Update your account information.</li>
            <li><strong>Deletion</strong>: Delete your photos, results, or account at any time.</li>
            <li><strong>Opt-In/Out</strong>: Control whether a photo is public in the gallery.</li>
            <li><strong>Consent</strong>: We do not train models on your photos unless you explicitly opt in.</li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">7. International Transfers</h2>
          <p>Your data may be processed in regions where our providers operate. We use reasonable safeguards consistent with applicable law when transferring data internationally.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">8. Children&apos;s Privacy</h2>
          <p>Our service is not directed to children under 13. We do not knowingly collect personal data from children. If you believe a child has provided data, contact us to remove it.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">9. Security</h2>
          <p>We employ technical and organizational measures (e.g., access controls, encryption in transit, signed URLs for private images) to help protect your data. No method is 100% secure; please use strong credentials and keep them confidential.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">10. Cookies</h2>
          <p>We use cookies and similar technologies for essential functionality, session management, and analytics. You can manage cookie preferences in your browser settings.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes take effect when posted on this page. If changes are material, we will provide additional notice as appropriate.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">12. Contact Us</h2>
          <p>If you have questions about this policy or your data, contact us at <a className="text-pink-700 hover:underline" href="mailto:privacy@makeupinsight.us">privacy@makeupinsight.us</a> or <a className="text-pink-700 hover:underline" href="mailto:support@makeupinsight.us">support@makeupinsight.us</a>.</p>
        </div>
      </div>
    </main>
  );
}


