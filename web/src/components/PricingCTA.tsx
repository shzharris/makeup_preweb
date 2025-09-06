export function PricingCTA() {
  return (
    <section id="pricing" className="bg-[--brand-50]">
      <div className="container-pad py-16">
        <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold">Start your personalized makeup analysis</h2>
          <p className="mt-2 text-gray-600">Monthly subscription. Cancel anytime.</p>
          <div className="mt-6 flex justify-center">
            <a className="btn-primary" href="/pricing">See pricing</a>
          </div>
        </div>
      </div>
    </section>
  );
}


