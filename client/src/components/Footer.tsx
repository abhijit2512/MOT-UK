export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} MOTMate UK · MVP demo, not affiliated with DVSA.</span>
        <span>Mock MOT data shown unless real DVSA credentials are configured.</span>
      </div>
    </footer>
  );
}
