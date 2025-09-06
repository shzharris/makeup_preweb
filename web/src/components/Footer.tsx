export function Footer() {
  return (
    <footer className="border-t border-black/5 mt-20">
      <div className="container-pad py-10 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} AI Makeup Insight · All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-gray-700">Privacy</a>
          <a href="/terms" className="hover:text-gray-700">Terms</a>
        </div>
      </div>
    </footer>
  );
}


