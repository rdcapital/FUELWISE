/**
 * Dashboard.jsx
 * Main dashboard page.
 *
 * Demonstrates:
 *  - Custom hooks (useFuelLogs)
 *  - Derived state via useMemo
 *  - Conditional rendering for empty states
 *  - Array methods: map, reduce, filter, sort
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFuelLogs } from '../hooks/useFuelLogs';
import { useApp } from '../context/AppContext';
import { computeSummary, estimatedRange, getFuelEconomyHint } from '../utils/calculations';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import StatCard from '../components/ui/StatCard';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import {
  Fuel, DollarSign, Gauge, MapPin, TrendingUp, Car, Plus, ArrowRight,
  Droplets, Zap,
} from 'lucide-react';

export default function Dashboard() {
  const { logs } = useFuelLogs();
  const { vehicle } = useApp();

  // Derive summary stats — useMemo prevents recalculating on every render
  const summary = useMemo(() => {
    const sorted = [...logs].sort((a, b) => Number(a.odometer) - Number(b.odometer));
    return computeSummary(sorted);
  }, [logs]);

  const range = useMemo(
    () => estimatedRange(summary.avgEconomy, vehicle.tankCapacity),
    [summary.avgEconomy, vehicle.tankCapacity]
  );

  const economyHint = useMemo(
    () => getFuelEconomyHint(summary.avgEconomy, summary.costPerKm),
    [summary.avgEconomy, summary.costPerKm]
  );

  // Last 5 logs sorted by date (newest first) for the recent activity list
  const recentLogs = useMemo(
    () => [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [logs]
  );

  const statCards = [
    {
      label: 'Total Fuel Purchased',
      value: formatNumber(summary.totalLitres, 1, ' L'),
      icon: Droplets,
      gradient: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600',
    },
    {
      label: 'Total Fuel Cost',
      value: formatCurrency(summary.totalCost),
      icon: DollarSign,
      gradient: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Avg Fuel Economy',
      value: summary.avgEconomy ? formatNumber(summary.avgEconomy, 2, ' km/L') : '—',
      icon: Gauge,
      gradient: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Cost per Kilometre',
      value: summary.costPerKm ? formatCurrency(summary.costPerKm) + '/km' : '—',
      icon: TrendingUp,
      gradient: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Est. Remaining Range',
      value: range ? formatNumber(range, 0, ' km') : '—',
      subValue: `Based on ${vehicle.tankCapacity}L full tank`,
      icon: Zap,
      gradient: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Total Distance',
      value: formatNumber(summary.totalDistance, 0, ' km'),
      icon: MapPin,
      gradient: 'bg-rose-100 dark:bg-rose-900/30',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-7 animate-[fadeIn_0.3s_ease-out]">
      {/* Vehicle hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 p-6 text-white shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Car size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium">Your Vehicle</p>
              <h2 className="text-2xl font-bold">{vehicle.name}</h2>
              {vehicle.make && (
                <p className="text-white/80 text-sm mt-0.5">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.licensePlate && ` · ${vehicle.licensePlate}`}
                </p>
              )}
            </div>
          </div>
          <Link
            to="/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl
              text-sm font-semibold transition-all backdrop-blur-sm border border-white/20"
          >
            <Plus size={16} />
            Add Fuel Log
          </Link>
        </div>

        {/* Inline mini-stats */}
        <div className="relative mt-5 pt-4 border-t border-white/20 grid grid-cols-3 gap-4">
          {[
            { label: 'Fill-ups', value: logs.length },
            { label: 'Best km/L', value: summary.bestEconomy ? formatNumber(summary.bestEconomy, 2) : '—' },
            { label: 'Tank (L)', value: vehicle.tankCapacity },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-white/60 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-800 shadow-sm dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
        <p className="font-semibold">Fuel efficiency hint</p>
        <p className="mt-1">{economyHint}</p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-700/70 dark:bg-slate-800/90 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${card.gradient}`}>
                <card.icon size={20} className={card.iconColor} />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
              {card.subValue && (
                <p className="text-xs text-slate-400 mt-0.5">{card.subValue}</p>
              )}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent fuel logs */}
      <Card>
        <CardHeader
          title="Recent Fuel Logs"
          subtitle="Your latest fill-ups"
          action={
            logs.length > 0 && (
              <Link
                to="/history"
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight size={12} />
              </Link>
            )
          }
        />

        {recentLogs.length === 0 ? (
          <EmptyState
            icon={Fuel}
            title="No fuel logs yet"
            message="Add your first fill-up to start tracking your fuel consumption."
            action={
              <Link to="/add" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30">
                <Plus size={15} /> Add First Log
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30
                  hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex-shrink-0">
                  <Fuel size={14} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {log.station || 'Unknown Station'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(log.date)} · {formatNumber(log.liters, 1, 'L')} · {log.fuelType}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(log.totalCost)}
                  </p>
                  <p className="text-xs text-slate-400">{formatNumber(log.odometer, 0, ' km')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
