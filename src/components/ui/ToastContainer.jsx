/**
 * Toast.jsx + ToastContainer.jsx
 * Individual toast notification and its container.
 */
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-700',
    icon_color: 'text-emerald-500',
    text: 'text-emerald-800 dark:text-emerald-200',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-700',
    icon_color: 'text-red-500',
    text: 'text-red-800 dark:text-red-200',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    icon_color: 'text-amber-500',
    text: 'text-amber-800 dark:text-amber-200',
  },
  info: {
    icon: Info,
    bg: 'bg-cyan-50 dark:bg-cyan-900/30',
    border: 'border-cyan-200 dark:border-cyan-700',
    icon_color: 'text-cyan-500',
    text: 'text-cyan-800 dark:text-cyan-200',
  },
};

function Toast({ id, message, type }) {
  const { removeToast } = useToast();
  const c = CONFIG[type] ?? CONFIG.info;
  const Icon = c.icon;

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-[slideInRight_0.3s_ease-out] ${c.bg} ${c.border}`}
    >
      <Icon size={18} className={`mt-0.5 flex-shrink-0 ${c.icon_color}`} />
      <p className={`flex-1 text-sm font-medium ${c.text}`}>{message}</p>
      <button
        onClick={() => removeToast(id)}
        className={`flex-shrink-0 ${c.icon_color} hover:opacity-70`}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
}
