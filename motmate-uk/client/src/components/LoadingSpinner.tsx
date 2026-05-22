import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{label ?? 'Loading…'}</span>
    </div>
  );
}
