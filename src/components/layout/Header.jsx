/**
 * Header.jsx
 * Top bar — shows current page title, dark mode toggle, and mobile menu button.
 */
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, Moon, Sun, Fuel } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/add': 'Add Fuel Log',
  '/history': 'Fuel History',
  '/analytics': 'Analytics',
  '/maintenance': 'Maintenance',
  '/reports': 'Reports',
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { darkMode, toggleDarkMode } = useApp();

  const title = PAGE_TITLES[pathname] ?? 'FuelWise';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/80 px-5 backdrop-blur-md dark:border-slate-700/60 dark:bg-surface-800/80">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 transition-colors hover:bg-slate-100 lg:hidden dark:hover:bg-slate-700"
        aria-label="Open navigation"
      >
        <Menu size={20} className="text-slate-600 dark:text-slate-300" />
      </button>

      <div className="flex items-center gap-1.5 lg:hidden">
        <Fuel size={16} className="text-indigo-500" />
        <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-sm font-bold text-transparent">
          FuelWise
        </span>
      </div>

      <h2 className="hidden text-lg font-semibold text-slate-800 dark:text-slate-100 lg:block">
        {title}
      </h2>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="rounded-xl bg-slate-100 p-2 text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
