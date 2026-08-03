/**
 * Badge.jsx
 * Small pill-shaped label with colour variants.
 */
const VARIANT_CLASSES = {
  default:  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  success:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info:     'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  primary:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  purple:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default} ${className}`}
    >
      {children}
    </span>
  );
}
