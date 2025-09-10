"use client";

import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-40" role="banner">
      <div className="container-pad h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full" style={{background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))'}} />
          <span className="text-base font-semibold tracking-tight">AI Makeup Insight</span>
        </div>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-600" aria-label="Primary">
          <a
            href="/"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="/makeup_analysis"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Makeup Analysis
          </a>
          <a
            href="/discover_makeup"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Discover Makeup
          </a>
          {/* <a
            href="/makeup_tips"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            Makeup Tips
          </a> */}
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          <a className="btn-primary" href="/login">Sign in</a>
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
            <a href="/" onClick={close} className="hover:text-gray-900">Home</a>
            <a href="/makeup_analysis" onClick={close} className="hover:text-gray-900">Makeup Analysis</a>
            <a href="/discover_makeup" onClick={close} className="hover:text-gray-900">Discover Makeup</a>
            <a href="/makeup_tips" onClick={close} className="hover:text-gray-900">Makeup Tips</a>
            <div className="pt-2 flex items-center gap-3">
              <a className="btn-primary" href="/login" onClick={close}>Sign in</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


