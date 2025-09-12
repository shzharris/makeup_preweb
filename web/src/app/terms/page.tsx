import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using Makeup Insight AI.",
  openGraph: {
    title: "Terms & Conditions | Makeup Insight AI",
    description: "The terms for using Makeup Insight AI.",
    url: absoluteUrl("/terms"),
    images: [{ url: "/api/og?title=Terms%20%26%20Conditions", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Makeup Insight AI",
    description: "The terms for using Makeup Insight AI.",
    images: ["/api/og?title=Terms%20%26%20Conditions"],
  },
};

export default function TermsPage() {
  return (
    <main className="section-soft section-pad">
      <div className="container-pad">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-2">Updated: September 12, 2025</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur p-6 shadow-sm text-gray-700 leading-relaxed">
          <h2 className="text-xl font-semibold text-pink-800">1. Acceptance of Terms</h2>
          <p>Welcome to MakeupInsight.us (the “Service”). By accessing or using the Service, you agree to be bound by these Terms of Service (“Terms”). If you do not agree, do not use the Service.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">2. Service Description</h2>
          <p>MakeupInsight.us provides AI-powered makeup analysis. Users may upload photos for analysis, view results, and optionally share uploads in a public gallery. Paid plans and one-time purchases may apply.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">3. Accounts &amp; Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be at least 13 years old to use the Service.</li>
            <li>When signing in with Google, you agree to provide accurate information and maintain the security of your account.</li>
            <li>You are responsible for all activities under your account.</li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">4. User Content &amp; License</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You retain ownership of photos and content you upload.</li>
            <li>By uploading, you grant us a limited, worldwide, non-exclusive license to host, process, and display your content solely to provide the Service.</li>
            <li>Public display occurs only if you enable the “public” option for a specific upload. You may revoke this later to remove it from the gallery.</li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">5. Payments &amp; Subscriptions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Payments are processed by Stripe. By purchasing a plan, you authorize Stripe to charge your payment method.</li>
            <li>You can cancel anytime; access persists through the paid period.</li>
            <li>Fees are non-refundable except as required by law.</li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">6. Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>No unlawful, harmful, or infringing content.</li>
            <li>No attempts to disrupt, reverse engineer, or abuse the Service.</li>
            <li>No uploading of others’ personal data or images without consent.</li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">7. Privacy</h2>
          <p>Your use of the Service is governed by our Privacy Policy. Please review it to understand how we collect and use your information.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">8. Intellectual Property</h2>
          <p>The Service, including software, models, and branding, is owned by MakeupInsight.us or its licensors. Except for your content, you receive no rights other than those expressly granted in these Terms.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">9. Disclaimers</h2>
          <p>The Service is provided “as is” without warranties of any kind. We do not guarantee accuracy of analysis, uninterrupted availability, or fitness for a particular purpose.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">10. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, MakeupInsight.us shall not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of data, profits, or business arising out of your use of the Service.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">11. Termination</h2>
          <p>We may suspend or terminate access for violations of these Terms or for security and legal reasons. You may stop using the Service at any time; certain obligations (e.g., payment, compliance) may survive termination.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">12. Governing Law</h2>
          <p>These Terms are governed by applicable laws where we operate, without regard to conflict of laws principles.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">13. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Changes take effect when posted. If changes are material, we will provide additional notice.</p>

          <h2 className="mt-6 text-lg font-semibold text-pink-800">14. Contact</h2>
          <p>Questions about these Terms? Contact <a className="text-pink-700 hover:underline" href="mailto:support@makeupinsight.us">support@makeupinsight.us</a>.</p>
        </div>
      </div>
    </main>
  );
}


