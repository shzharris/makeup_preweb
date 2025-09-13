"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Auto-trigger Google sign-in on page load to avoid extra click
    signIn("google", { callbackUrl: "/makeup_analysis" });
  }, []);

  return (
    <main className="container-pad py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-6">Redirecting to Google…</h1>
        <p className="text-sm text-gray-600">If nothing happens, please check pop-up blockers.</p>
      </div>
    </main>
  );
}


