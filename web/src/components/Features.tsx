const items = [
  { title: 'Subscription check', desc: 'Redirect to pricing if plan is missing or expired.' },
  { title: 'Upload & Camera', desc: 'Mobile-friendly camera capture and file upload.' },
  { title: 'AI Analysis', desc: 'Google GenAI streaming insights and visual overlays.' },
  { title: 'Public Gallery', desc: 'Opt-in sharing to inspire and discover looks.' },
  { title: 'Usage Records', desc: 'Track each run and results in your dashboard.' },
  { title: 'Privacy-first', desc: 'Private photos use signed URLs with strict access.' },
];

export function Features() {
  return (
    <section id="features">
      <div className="container-pad py-16">
        <h2 className="text-2xl sm:text-3xl font-bold">What you get</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((f) => (
            <div key={f.title} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-10 w-10 rounded-full mb-3" style={{background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))'}} />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


