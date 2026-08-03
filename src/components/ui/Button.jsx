/**
 * Button.jsx
 * Reusable button component with Tailwind-based variants.
 */
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }[size];

  const variantClass = {
    primary: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30',
    secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    danger: 'bg-rose-50 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/40',
    ghost: 'bg-transparent text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
  }[variant] ?? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold disabled:cursor-not-allowed disabled:opacity-55 ${variantClass} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
