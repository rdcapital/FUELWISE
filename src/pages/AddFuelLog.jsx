/**
 * AddFuelLog.jsx
 * Form page for adding a new fuel log entry.
 *
 * Demonstrates:
 *  - Controlled form inputs (useState)
 *  - Form validation
 *  - Derived state (auto-calculated total cost)
 *  - useFuelLogs custom hook
 *  - Toast notifications
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFuelLogs } from '../hooks/useFuelLogs';
import { useToast } from '../context/ToastContext';
import { FUEL_TYPES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Fuel, Calculator, CheckCircle } from 'lucide-react';

// Initial form state — all fields start empty / default
const INITIAL_FORM = {
  date: new Date().toISOString().split('T')[0], // today's date in YYYY-MM-DD
  odometer: '',
  liters: '',
  pricePerLiter: '',
  station: '',
  fuelType: FUEL_TYPES[0],
  notes: '',
};

/** Validate a single field — returns an error message string or '' */
function validateField(name, value) {
  switch (name) {
    case 'date': return value ? '' : 'Date is required';
    case 'odometer': return Number(value) > 0 ? '' : 'Enter a valid odometer reading';
    case 'liters': return Number(value) > 0 ? '' : 'Enter litres purchased';
    case 'pricePerLiter': return Number(value) > 0 ? '' : 'Enter price per litre';
    default: return '';
  }
}

export default function AddFuelLog() {
  const navigate = useNavigate();
  const { addLog } = useFuelLogs();
  const { addToast } = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-calculate total cost whenever liters or pricePerLiter changes
  const totalCost =
    form.liters && form.pricePerLiter
      ? (Number(form.liters) * Number(form.pricePerLiter)).toFixed(2)
      : null;

  /** Update a single form field and clear its error */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Live validation: clear error as soon as field becomes valid
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  /** Validate all required fields and return true if all pass */
  function validate() {
    const required = ['date', 'odometer', 'liters', 'pricePerLiter'];
    const newErrors = {};
    required.forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate a brief async save (could be an API call in a real app)
    await new Promise((r) => setTimeout(r, 600));

    addLog({
      ...form,
      totalCost: Number(totalCost),
    });

    setSubmitting(false);
    setSubmitted(true);
    addToast('Fuel log saved successfully!', 'success');

    // Reset after a short delay so the user sees the success state
    setTimeout(() => {
      setForm(INITIAL_FORM);
      setSubmitted(false);
      navigate('/history');
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-2xl animate-[fadeIn_0.3s_ease-out]">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add Fuel Log</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Record a new fill-up to track your fuel consumption and costs.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Card className="space-y-5">
          {/* Row: Date + Odometer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Date" error={errors.date} required>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 ${errors.date ? 'border-rose-400 ring-4 ring-rose-100 dark:border-rose-400 dark:ring-rose-900/30' : ''}`}
              />
            </Field>
            <Field label="Odometer Reading (km)" error={errors.odometer} required>
              <input
                type="number"
                name="odometer"
                value={form.odometer}
                onChange={handleChange}
                className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 ${errors.odometer ? 'border-rose-400 ring-4 ring-rose-100 dark:border-rose-400 dark:ring-rose-900/30' : ''}`}
                placeholder="e.g. 45320"
                min="0"
              />
            </Field>
          </div>

          {/* Row: Liters + Price per Liter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Litres Purchased" error={errors.liters} required>
              <input
                type="number"
                name="liters"
                value={form.liters}
                onChange={handleChange}
                className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 ${errors.liters ? 'border-rose-400 ring-4 ring-rose-100 dark:border-rose-400 dark:ring-rose-900/30' : ''}`}
                placeholder="e.g. 40.5"
                step="0.01"
                min="0"
              />
            </Field>
            <Field label="Price per Litre (₵)" error={errors.pricePerLiter} required>
              <input
                type="number"
                name="pricePerLiter"
                value={form.pricePerLiter}
                onChange={handleChange}
                className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 ${errors.pricePerLiter ? 'border-rose-400 ring-4 ring-rose-100 dark:border-rose-400 dark:ring-rose-900/30' : ''}`}
                placeholder="e.g. 58.50"
                step="0.01"
                min="0"
              />
            </Field>
          </div>

          {/* Auto-calculated total cost banner */}
          {totalCost && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50
              dark:from-indigo-900/20 dark:to-cyan-900/20 border border-indigo-100 dark:border-indigo-800/40">
              <Calculator size={18} className="text-indigo-500 flex-shrink-0" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Total Cost:</span>
              <span className="ml-auto text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(Number(totalCost))}
              </span>
            </div>
          )}

          {/* Row: Station + Fuel Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Fuel Station">
              <input
                type="text"
                name="station"
                value={form.station}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
                placeholder="e.g. Petron, Shell, Caltex"
              />
            </Field>
            <Field label="Fuel Type">
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40">
                {FUEL_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes (optional)">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40 resize-none"
              rows={3}
              placeholder="Any additional notes about this fill-up…"
            />
          </Field>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={submitted ? <CheckCircle size={16} /> : <Fuel size={16} />}
              className="flex-1"
            >
              {submitted ? 'Saved!' : 'Save Fuel Log'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

/** Reusable form field wrapper with label and error message */
function Field({ label, children, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
