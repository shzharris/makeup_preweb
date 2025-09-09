export function PricingGrid() {
  return (
    <section id="pricing" className="section-accent section-pad">
      <div className="container-pad relative">
        {/* Decorative divider */}
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-white/60 blur-2xl rounded-b-[50%]" />
        </div>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that fits you. Cancel anytime.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* One-time */}
          <div className="group rounded-xl border-2 border-transparent hover:border-[--color-brand-400] bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[--color-brand-400]">
            <h3 className="text-lg font-semibold">One-time</h3>
            <p className="text-sm text-gray-600 mt-1">Pay once. Use once.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">$0.99</span>
              <span className="text-sm text-gray-500">/ per use</span>
            </div>
            <a href="/pricing/subscribe?plan=one-time" className="btn-cta mt-6 inline-flex">Purchase</a>
          </div>

          {/* Monthly (Most popular) */}
          <div className="group rounded-xl border-2 border-transparent hover:border-[--color-brand-400] bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[--color-brand-400]">
            <span className="absolute -top-3 left-4 rounded-full bg-[--brand-100] text-[--color-brand-600] text-xs px-3 py-1 border border-[--brand-200]">Most popular</span>
            <h3 className="text-lg font-semibold">Monthly</h3>
            <p className="text-sm text-gray-600 mt-1">Unlimited access for 1 month.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">$9.99</span>
              <span className="text-sm text-gray-500">/ month</span>
            </div>
            <a href="/pricing/subscribe?plan=monthly" className="btn-cta mt-6 inline-flex">Subscribe</a>
          </div>

          {/* 6 Months */}
          <div className="group rounded-xl border-2 border-transparent hover:border-[--color-brand-400] bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[--color-brand-400]">
            <h3 className="text-lg font-semibold">6 Months</h3>
            <p className="text-sm text-gray-600 mt-1">Best value for half-year access.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">$49.99</span>
              <span className="text-sm text-gray-500">/ 6 months</span>
            </div>
            <a href="/pricing/subscribe?plan=half-year" className="btn-cta mt-6 inline-flex">Subscribe</a>
          </div>
        </div>
      </div>
    </section>
  );
}


