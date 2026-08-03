/**
 * Card.jsx
 * Wrapper component that applies consistent, Tailwind-driven card styling.
 */
export default function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 transition-all duration-200 dark:border-slate-700/70 dark:bg-slate-800/90 ${hover ? 'cursor-pointer shadow-lg shadow-indigo-500/10 hover:-translate-y-0.5' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Section heading inside a card */
export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
