"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { 
  SparklesIcon, 
  CrownIcon
} from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  type SessionUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatar_url?: string | null;
  };
  const su = (session?.user ?? undefined) as SessionUser | undefined;
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-40" role="banner">
      <div className="container-pad h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
              <div className="relative">
                <CrownIcon className="w-8 h-8 text-pink-500" />
                <SparklesIcon className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  <Link href="/"> Makeup Insight AI </Link>
                </h3>
              </div>
            </div>
        </div>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-600" aria-label="Primary">
          <Link href="/" className="hover:text-pink-500 transition-colors duration-200">Home</Link>
          <Link href="/makeup_analysis" className="hover:text-pink-500 transition-colors duration-200">Makeup Analysis</Link>
          <Link href="/discover_makeup" className="hover:text-pink-500 transition-colors duration-200">Discover Makeup</Link>
          {/* <Link href="/makeup_tips" className="hover:text-pink-500 transition-colors duration-200">Makeup Tips</Link> */}
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Image
                src={su?.avatar_url || su?.image || "/system/logo.png"}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full border border-black/10"
                unoptimized
                data-origin-src={su?.avatar_url || su?.image || "/system/logo.png"}
              />
              <span className="text-sm text-gray-700">
                {(session.user?.name && session.user.name.trim()) ? session.user.name : "custom"}
              </span>
              <button
                className="btn-secondary rounded-full border border-black/20 p-5"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={() => signIn("google", { callbackUrl: "/makeup_analysis" })}
            >
              Sign in
            </button>
          )}
        </div>
        {/* Mobile hamburger icon */}
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-gray-700"
          onClick={toggle}
        >
          {/* simple hamburger icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="sm:hidden border-t border-black/5 bg-white" role="dialog" aria-modal="true">
          <div className="container-pad py-4 flex flex-col gap-4 text-sm">
            <Link href="/" onClick={close} className="hover:text-gray-900">Home</Link>
            <Link href="/makeup_analysis" onClick={close} className="hover:text-gray-900">Makeup Analysis</Link>
            <Link href="/discover_makeup" onClick={close} className="hover:text-gray-900">Discover Makeup</Link>
            {/* <Link href="/makeup_tips" onClick={close} className="hover:text-gray-900">Makeup Tips</Link> */}
            <div className="pt-2 flex items-center gap-3">
              {status === "authenticated" ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={su?.avatar_url || su?.image || "/system/logo.png"}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full border border-black/10"
                    unoptimized
                    data-origin-src={su?.avatar_url || su?.image || "/system/logo.png"}
                  />
                  <span className="text-sm">{(session.user?.name && session.user.name.trim()) ? session.user.name : "custom"}</span>
                  <button className="btn-secondary rounded-full border border-black/20" onClick={() => { close(); signOut({ callbackUrl: "/" }); }}>Logout</button>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => { close(); signIn("google", { callbackUrl: "/makeup_analysis" }); }}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


