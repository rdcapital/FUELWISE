/**
 * EmptyState.jsx
 * Displayed when a list or dataset is empty.
 */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-[fadeIn_0.3s_ease-out]">
      {Icon && (
        <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-700/50">
          <Icon size={40} className="text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      {message && <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
