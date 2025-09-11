import Link from "next/link";

export function Hero() {
  return (
    <section className="gradient-hero section-pad">
      <div className="container-pad">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Makeup Insight AI
              <span className="block text-xl sm:text-3xl text-[--color-brand-600]">Beauty, intelligently personalized</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-prose">
              Upload a selfie to detect makeup issues and receive tailored suggestions. Opt-in to share with the community gallery for inspiration.
            </p>
            <div className="mt-8 flex gap-3">
              <Link className="btn-primary" href="/upload">Get started</Link>
              <Link className="btn-ghost" href="#features">Learn more</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
            <div className="aspect-[4/3] w-full rounded-xl bg-[--brand-50] grid place-items-center text-[--color-brand-600] text-sm">
              Preview placeholder (replace with before/after example)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


