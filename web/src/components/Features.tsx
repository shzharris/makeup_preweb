function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" transform="translate(7 3)"/>
      <path d="M3 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>
    </svg>
  );
}

const items = [
  { title: 'Step 1 — Take a photo', desc: 'Capture your current makeup look with your phone or camera.', Icon: IconCamera },
  { title: 'Step 2 — Upload', desc: 'Use our tool to upload the photo (mobile-friendly & quick).', Icon: IconUpload },
  { title: 'Step 3 — Get results', desc: 'Wait a moment while we analyze and display your insights.', Icon: IconSparkles },
];

export function Features() {
  return (
    <section id="features">
      <div className="container-pad py-16">
        <h2 className="text-2xl sm:text-3xl font-bold">How to do</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ title, desc, Icon }) => (
            <div key={title} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-12 w-12 rounded-xl mb-3 grid place-items-center text-[--color-brand-600]"
                   style={{background: 'linear-gradient(135deg, var(--brand-50), #ffffff)'}}>
                <Icon />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


