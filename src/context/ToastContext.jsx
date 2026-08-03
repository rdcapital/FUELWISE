/**
 * ToastContext.jsx
 * Lightweight toast notification system.
 *
 * Usage (from any component):
 *   const { addToast } = useToast();
 *   addToast('Fuel log saved!', 'success');
 *
 * Toast types: 'success' | 'error' | 'warning' | 'info'
 */
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /** Add a new toast.  It auto-removes after `duration` ms. */
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  /** Manually dismiss a toast by id */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
