/**
 * StatCard.jsx
 * A summary metric card used on the dashboard and reports pages.
 */
export default function StatCard({ label, value, subValue, icon: Icon, gradient, trend }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-700/70 dark:bg-slate-800/90 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${gradient ?? 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
          {Icon && <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />}
        </div>
        {trend && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trend.positive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold leading-tight text-slate-800 dark:text-slate-100">
          {value ?? '—'}
        </p>
        {subValue && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subValue}</p>}
      </div>

      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
