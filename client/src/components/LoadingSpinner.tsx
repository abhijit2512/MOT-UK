import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <Loader2 size={18} className="animate-spin" />
      <span>{label ?? 'Loading…'}</span>
    </div>
  );
}
