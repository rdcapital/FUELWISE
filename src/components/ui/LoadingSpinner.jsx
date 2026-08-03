/**
 * LoadingSpinner.jsx
 * Centred spinner for loading states.
 */
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={36} className="animate-spin text-indigo-500" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
