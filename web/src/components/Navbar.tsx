export function Navbar() {
  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="container-pad h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full" style={{background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))'}} />
          <span className="text-base font-semibold tracking-tight">AI Makeup Insight</span>
        </div>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#gallery" className="hover:text-gray-900">Gallery</a>
          <a href="#pricing" className="hover:text-gray-900">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <a className="btn-ghost" href="/login">Sign in</a>
          <a className="btn-primary" href="/upload">Get started</a>
        </div>
      </div>
    </header>
  );
}


