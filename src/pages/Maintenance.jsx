/**
 * Maintenance.jsx
 * Track vehicle maintenance records with mileage-based reminders.
 *
 * Demonstrates:
 *  - useMaintenance custom hook
 *  - Derived/computed data (reminders from records)
 *  - Complex conditional rendering (overdue / upcoming / ok badges)
 *  - Modal for adding new records
 */
import { useState, useMemo } from 'react';
import { useMaintenance } from '../hooks/useMaintenance';
import { useFuelLogs } from '../hooks/useFuelLogs';
import { useToast } from '../context/ToastContext';
import { MAINTENANCE_TYPES } from '../utils/constants';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock, Trash2, Pencil } from 'lucide-react';

const INITIAL_FORM = {
  type: MAINTENANCE_TYPES[0].value,
  date: new Date().toISOString().split('T')[0],
  odometer: '',
  cost: '',
  notes: '',
};

export default function Maintenance() {
  const { records, addRecord, deleteRecord, getReminders } = useMaintenance();
  const { logs } = useFuelLogs();
  const { addToast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'reminders'

  // Current odometer = highest odometer across all fuel logs
  const currentOdometer = useMemo(
    () =>
      logs.length > 0
        ? Math.max(...logs.map((l) => Number(l.odometer)))
        : 0,
    [logs]
  );

  const reminders = useMemo(() => getReminders(currentOdometer), [getReminders, currentOdometer]);

  // Sorted reminders: overdue first, then upcoming, then ok
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if (a.overdue && !b.overdue) return -1;
      if (!a.overdue && b.overdue) return 1;
      if (a.upcoming && !b.upcoming) return -1;
      if (!a.upcoming && b.upcoming) return 1;
      return 0;
    });
  }, [reminders]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.date) errs.date = 'Required';
    if (!Number(form.odometer) > 0) errs.odometer = 'Enter a valid odometer';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAdd() {
    if (!form.odometer || Number(form.odometer) <= 0) {
      setErrors({ odometer: 'Enter a valid odometer reading' });
      return;
    }
    addRecord(form);
    setShowAdd(false);
    setForm(INITIAL_FORM);
    addToast('Maintenance record added!', 'success');
  }

  function handleDelete() {
    deleteRecord(deleteTarget.id);
    setDeleteTarget(null);
    addToast('Maintenance record deleted.', 'warning');
  }

  // Get label for maintenance type value
  const typeLabel = (val) =>
    MAINTENANCE_TYPES.find((t) => t.value === val)?.label ?? val;

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Maintenance</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {records.length} record{records.length !== 1 ? 's' : ''} · Current odometer:{' '}
            {formatNumber(currentOdometer, 0, ' km')}
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Record
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[
          { label: 'Records', value: 'records' },
          { label: 'Reminders', value: 'reminders' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.value
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            {tab.label}
            {tab.value === 'reminders' && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${reminders.filter((r) => r.overdue).length > 0
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500'}`}>
                {reminders.filter((r) => r.overdue || r.upcoming).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* RECORDS TAB */}
      {activeTab === 'records' && (
        <>
          {records.length === 0 ? (
            <Card>
              <EmptyState
                icon={Wrench}
                title="No maintenance records"
                message="Track oil changes, tire rotations, and more."
                action={
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30" onClick={() => setShowAdd(true)}>
                    <Plus size={15} /> Add First Record
                  </button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {[...records]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record) => (
                  <div key={record.id} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-700/70 dark:bg-slate-800/90">
                    <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex-shrink-0">
                      <Wrench size={18} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {typeLabel(record.type)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(record.date)} · {formatNumber(record.odometer, 0, ' km')}
                        {record.cost > 0 && ` · ${formatCurrency(record.cost)}`}
                      </p>
                      {record.notes && (
                        <p className="text-xs text-slate-400 mt-1 truncate">{record.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteTarget(record)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* REMINDERS TAB */}
      {activeTab === 'reminders' && (
        <div className="space-y-3">
          {currentOdometer === 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
              ⚠ Add fuel logs with odometer readings to enable reminders.
            </div>
          )}
          {sortedReminders.map((r) => (
            <ReminderRow
              key={r.value}
              reminder={r}
              currentOdometer={currentOdometer}
              onAdd={() => {
                setForm((f) => ({ ...f, type: r.value }));
                setShowAdd(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Maintenance Record">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
              Maintenance Type <span className="text-red-500">*</span>
            </label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40">
              {MAINTENANCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                Date <span className="text-red-500">*</span>
              </label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                Odometer (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="odometer"
                value={form.odometer}
                onChange={handleChange}
                className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 ${errors.odometer ? 'border-rose-400 ring-4 ring-rose-100 dark:border-rose-400 dark:ring-rose-900/30' : ''}`}
                placeholder="e.g. 45320"
              />
              {errors.odometer && <p className="text-xs text-red-500 mt-1">{errors.odometer}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Cost (₵)</label>
            <input type="number" name="cost" value={form.cost} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40" placeholder="0.00" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 resize-none" rows={2} placeholder="Parts used, shop name…" />
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30" onClick={handleAdd}>Add Record</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Record" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          Delete <strong>{deleteTarget ? typeLabel(deleteTarget.type) : ''}</strong> record from{' '}
          {deleteTarget ? formatDate(deleteTarget.date) : ''}?
        </p>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="flex-1 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/40" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

/** A single reminder row with status badge and progress */
function ReminderRow({ reminder, currentOdometer, onAdd }) {
  const { label, overdue, upcoming, neverDone, dueAt, lastDoneAt, intervalKm } = reminder;

  const statusVariant = overdue ? 'danger' : upcoming ? 'warning' : 'success';
  const StatusIcon = overdue ? AlertTriangle : upcoming ? Clock : CheckCircle;
  const statusText = overdue ? 'Overdue' : upcoming ? 'Due Soon' : neverDone ? 'Never Done' : 'OK';

  const progress = (() => {
    if (!lastDoneAt || !dueAt) return 0;
    const done = currentOdometer - lastDoneAt;
    const pct = Math.min((done / intervalKm) * 100, 100);
    return Math.max(pct, 0);
  })();

  const remaining = dueAt ? Math.max(dueAt - currentOdometer, 0) : null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/70 dark:border-slate-700/70 dark:bg-slate-800/90 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${overdue ? 'bg-red-100 dark:bg-red-900/30' : upcoming ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
            <StatusIcon size={15} className={overdue ? 'text-red-500' : upcoming ? 'text-amber-500' : 'text-emerald-500'} />
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{label}</p>
            <p className="text-xs text-slate-500">Every {formatNumber(intervalKm, 0, ' km')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>{statusText}</Badge>
          {(overdue || upcoming || neverDone) && (
            <button onClick={onAdd} className="rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30">
              Log Service
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {lastDoneAt !== null && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Last: {formatNumber(lastDoneAt, 0, ' km')}</span>
            {remaining !== null && (
              <span className={overdue ? 'text-red-500 font-medium' : ''}>
                {overdue ? `${formatNumber(Math.abs(dueAt - currentOdometer), 0)} km overdue` : `${formatNumber(remaining, 0)} km remaining`}
              </span>
            )}
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overdue ? 'bg-red-500' : upcoming ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
