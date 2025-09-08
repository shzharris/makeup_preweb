export function PricingGrid() {
  return (
    <section id="pricing" className="bg-[--brand-50]">
      <div className="container-pad py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Pricing</h2>
          <p className="mt-2 text-gray-600">Choose a plan that fits you. Cancel anytime.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* One-time */}
          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold">One-time</h3>
            <p className="text-sm text-gray-600 mt-1">Pay once. Use once.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">$0.99</span>
              <span className="text-sm text-gray-500">/ per use</span>
            </div>
            <a href="/pricing/subscribe?plan=one-time" className="btn-primary mt-6 inline-flex">Purchase</a>
          </div>

          {/* Monthly (Most popular) */}
          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm relative flex flex-col">
            <span className="absolute -top-3 left-4 rounded-full bg-[--brand-100] text-[--color-brand-600] text-xs px-3 py-1 border border-[--brand-200]">Most popular</span>
            <h3 className="text-lg font-semibold">Monthly</h3>
            <p className="text-sm text-gray-600 mt-1">Unlimited access for 1 month.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">$9.99</span>
              <span className="text-sm text-gray-500">/ month</span>
            </div>
            <a href="/pricing/subscribe?plan=monthly" className="btn-primary mt-6 inline-flex">Subscribe</a>
          </div>

          {/* 6 Months */}
          <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold">6 Months</h3>
            <p className="text-sm text-gray-600 mt-1">Best value for half-year access.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">$49.99</span>
              <span className="text-sm text-gray-500">/ 6 months</span>
            </div>
            <a href="/pricing/subscribe?plan=half-year" className="btn-primary mt-6 inline-flex">Subscribe</a>
          </div>
        </div>
      </div>
    </section>
  );
}


