/**
 * FuelHistory.jsx
 * Displays all fuel logs with search, filter, edit, and delete.
 *
 * Demonstrates:
 *  - Array methods: filter, sort, map
 *  - Controlled search/filter state
 *  - Modal for editing
 *  - Confirm-before-delete pattern
 */
import { useState, useMemo } from 'react';
import { useFuelLogs } from '../hooks/useFuelLogs';
import { useToast } from '../context/ToastContext';
import { FUEL_TYPES } from '../utils/constants';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { Fuel, Search, Filter, Pencil, Trash2, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Date (Newest)', value: 'date_desc' },
  { label: 'Date (Oldest)', value: 'date_asc' },
  { label: 'Odometer (High)', value: 'odo_desc' },
  { label: 'Cost (High)', value: 'cost_desc' },
  { label: 'Cost (Low)', value: 'cost_asc' },
];

export default function FuelHistory() {
  const { logs, updateLog, deleteLog } = useFuelLogs();
  const { addToast } = useToast();

  // Filter & sort state
  const [search, setSearch] = useState('');
  const [filterStation, setFilterStation] = useState('');
  const [filterFuelType, setFilterFuelType] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  // Edit modal state
  const [editTarget, setEditTarget] = useState(null); // the log being edited
  const [editForm, setEditForm] = useState({});

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Unique stations from all logs (for the filter dropdown)
  const stations = useMemo(
    () => [...new Set(logs.map((l) => l.station).filter(Boolean))].sort(),
    [logs]
  );

  // Apply search + filters + sort
  const filtered = useMemo(() => {
    let result = [...logs];

    // Text search across station, fuel type, notes
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.station?.toLowerCase().includes(q) ||
          l.fuelType?.toLowerCase().includes(q) ||
          l.notes?.toLowerCase().includes(q) ||
          formatDate(l.date).toLowerCase().includes(q)
      );
    }

    if (filterStation) result = result.filter((l) => l.station === filterStation);
    if (filterFuelType) result = result.filter((l) => l.fuelType === filterFuelType);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc': return new Date(a.date) - new Date(b.date);
        case 'odo_desc': return Number(b.odometer) - Number(a.odometer);
        case 'cost_desc': return Number(b.totalCost) - Number(a.totalCost);
        case 'cost_asc': return Number(a.totalCost) - Number(b.totalCost);
        default: return new Date(b.date) - new Date(a.date); // date_desc
      }
    });

    return result;
  }, [logs, search, filterStation, filterFuelType, sortBy]);

  function openEdit(log) {
    setEditTarget(log);
    setEditForm({ ...log });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-recalculate total cost
      if (name === 'liters' || name === 'pricePerLiter') {
        const l = name === 'liters' ? value : updated.liters;
        const p = name === 'pricePerLiter' ? value : updated.pricePerLiter;
        updated.totalCost = (Number(l) * Number(p)).toFixed(2);
      }
      return updated;
    });
  }

  function saveEdit() {
    updateLog(editTarget.id, editForm);
    setEditTarget(null);
    addToast('Fuel log updated!', 'success');
  }

  function confirmDelete() {
    deleteLog(deleteTarget.id);
    setDeleteTarget(null);
    addToast('Fuel log deleted.', 'warning');
  }

  function clearFilters() {
    setSearch('');
    setFilterStation('');
    setFilterFuelType('');
    setSortBy('date_desc');
  }

  const hasActiveFilters = search || filterStation || filterFuelType || sortBy !== 'date_desc';

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Header + stats */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Fuel History</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {logs.length} total log{logs.length !== 1 ? 's' : ''} · showing {filtered.length}
          </p>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <X size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* Search + Filters bar */}
      <Card className="!p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
            />
          </div>

          {/* Station filter */}
          <select
            value={filterStation}
            onChange={(e) => setFilterStation(e.target.value)}
            className="w-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
          >
            <option value="">All Stations</option>
            {stations.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Fuel type filter */}
          <select
            value={filterFuelType}
            onChange={(e) => setFilterFuelType(e.target.value)}
            className="w-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
          >
            <option value="">All Fuel Types</option>
            {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </Card>

      {/* Log list */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Fuel}
            title={logs.length === 0 ? 'No fuel logs yet' : 'No matching logs'}
            message={
              logs.length === 0
                ? 'Your fill-up records will appear here once you add them.'
                : 'Try adjusting your search or filters.'
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((log) => (
            <LogRow
              key={log.id}
              log={log}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Fuel Log">
        {editTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Date', name: 'date', type: 'date' },
                { label: 'Odometer (km)', name: 'odometer', type: 'number' },
                { label: 'Litres', name: 'liters', type: 'number' },
                { label: 'Price per Litre (₵)', name: 'pricePerLiter', type: 'number' },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">{label}</label>
                  <input type={type} name={name} value={editForm[name] ?? ''} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40" />
                </div>
              ))}
            </div>
            {/* Total cost preview */}
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
              <span className="text-xs text-slate-500">Total Cost: </span>
              <span className="font-bold text-indigo-600">{formatCurrency(Number(editForm.totalCost))}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Station</label>
                <input type="text" name="station" value={editForm.station ?? ''} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Fuel Type</label>
                <select name="fuelType" value={editForm.fuelType ?? ''} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40">
                  {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Notes</label>
              <textarea name="notes" value={editForm.notes ?? ''} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 resize-none" rows={2} />
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setEditTarget(null)}>Cancel</button>
              <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Fuel Log" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          Are you sure you want to delete the log from{' '}
          <strong>{deleteTarget ? formatDate(deleteTarget.date) : ''}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="flex-1 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/40" onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

/** A single fuel log row card */
function LogRow({ log, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-700/70 dark:bg-slate-800/90 animate-[fadeIn_0.3s_ease-out]">
      {/* Icon */}
      <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex-shrink-0">
        <Fuel size={18} className="text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            {log.station || 'Unknown Station'}
          </p>
          <Badge variant="primary">{log.fuelType}</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {formatDate(log.date)} · {formatNumber(log.odometer, 0, ' km')} · {formatNumber(log.liters, 2, ' L')} @ {formatCurrency(log.pricePerLiter)}/L
        </p>
      </div>

      {/* Cost */}
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {formatCurrency(log.totalCost)}
        </p>
        <p className="text-xs text-slate-400">total cost</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onEdit(log)}
          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          aria-label="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(log)}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          aria-label="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
