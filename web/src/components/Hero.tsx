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
              <Link className="btn-primary" href="/makeup_analysis">Get started</Link>
              <Link className="btn-ghost" href="#features">Learn more</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
            <div className="w-full sm:w-[470px] aspect-[4/3] rounded-xl bg-[--brand-50] grid place-items-center text-[--color-brand-600] text-sm text-center">
              <img src="/system/MakeupInstant.jpg" alt="Makeup Insight AI" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


