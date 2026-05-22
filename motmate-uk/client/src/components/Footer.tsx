export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} MOTMate UK — Local MVP demo.</p>
        <p className="text-slate-400">
          Mock MOT data shown for demo purposes. Not affiliated with DVSA.
        </p>
      </div>
    </footer>
  );
}
