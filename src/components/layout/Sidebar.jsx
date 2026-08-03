/**
 * Sidebar.jsx
 * Responsive navigation sidebar.
 */
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Plus,
  ClipboardList,
  BarChart3,
  Wrench,
  FileText,
  Fuel,
  Car,
  X,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import Modal from '../ui/Modal';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Add Fuel Log', icon: Plus, path: '/add' },
  { label: 'Fuel History', icon: ClipboardList, path: '/history' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
  { label: 'Reports', icon: FileText, path: '/reports' },
];

function SidebarContent({ onClose }) {
  const { vehicle, updateVehicle } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [form, setForm] = useState({ ...vehicle });

  function handleSave() {
    updateVehicle(form);
    setShowSettings(false);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-5 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-2 shadow-md">
            <Fuel size={18} className="text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-base font-bold text-transparent">
              FuelWise
            </h1>
            <p className="text-xs text-slate-400">Smart Fuel Log</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-700">
            <X size={18} className="text-slate-500" />
          </button>
        )}
      </div>

      <div className="mx-4 mb-2 mt-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 p-3 dark:border-indigo-800/40 dark:from-indigo-900/20 dark:to-cyan-900/20">
        <div className="flex items-center gap-2.5">
          <Car size={16} className="flex-shrink-0 text-indigo-500" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-indigo-700 dark:text-indigo-300">{vehicle.name}</p>
            {vehicle.make && (
              <p className="truncate text-[10px] text-indigo-500/80 dark:text-indigo-400/70">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.9rem] font-medium transition-all ${isActive
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-3 pb-4 pt-3 dark:border-slate-700/60">
        <button onClick={() => setShowSettings(true)} className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.9rem] font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400">
          <Settings size={18} />
          <span>Vehicle Settings</span>
        </button>
      </div>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Vehicle Settings">
        <div className="space-y-4">
          {[
            { label: 'Vehicle Name', key: 'name', type: 'text', placeholder: 'My Car' },
            { label: 'Make', key: 'make', type: 'text', placeholder: 'Toyota' },
            { label: 'Model', key: 'model', type: 'text', placeholder: 'Corolla' },
            { label: 'Year', key: 'year', type: 'number', placeholder: '2024' },
            { label: 'License Plate', key: 'licensePlate', type: 'text', placeholder: 'ABC 1234' },
            { label: 'Tank Capacity (L)', key: 'tankCapacity', type: 'number', placeholder: '50' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <input
                type={type}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
                value={form[key] ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setShowSettings(false)}>
              Cancel
            </button>
            <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className="fixed left-0 top-0 z-30 hidden min-h-screen w-60 flex-col border-r border-slate-100 bg-white dark:border-slate-700/60 dark:bg-surface-800 lg:flex">
        <SidebarContent />
      </aside>

      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden dark:bg-surface-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
