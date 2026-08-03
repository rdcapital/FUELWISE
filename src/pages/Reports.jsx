/**
 * Reports.jsx
 * Summary report page with fuel and maintenance statistics.
 *
 * Demonstrates:
 *  - useMemo for expensive derived calculations
 *  - Array reduce for aggregations
 *  - Conditional rendering of report sections
 */
import { useMemo } from 'react';
import { useFuelLogs } from '../hooks/useFuelLogs';
import { useMaintenance } from '../hooks/useMaintenance';
import { computeSummary, buildMonthlyData } from '../utils/calculations';
import { formatCurrency, formatNumber, formatDate, formatMonthLabel } from '../utils/formatters';
import { FUEL_TYPES } from '../utils/constants';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { FileText, TrendingUp, Award, Fuel, Calendar, DollarSign } from 'lucide-react';

export default function Reports() {
  const { logs } = useFuelLogs();
  const { records } = useMaintenance();

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => Number(a.odometer) - Number(b.odometer)),
    [logs]
  );

  const summary = useMemo(() => computeSummary(sortedLogs), [sortedLogs]);
  const monthlyData = useMemo(() => buildMonthlyData(sortedLogs), [sortedLogs]);

  // Total maintenance cost
  const totalMaintenanceCost = useMemo(
    () => records.reduce((s, r) => s + Number(r.cost || 0), 0),
    [records]
  );

  // Average monthly fuel spend
  const avgMonthlySpend = useMemo(() => {
    if (monthlyData.length === 0) return 0;
    return monthlyData.reduce((s, m) => s + m.spending, 0) / monthlyData.length;
  }, [monthlyData]);

  // Fuel type breakdown
  const fuelTypeBreakdown = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      const t = l.fuelType || 'Unknown';
      if (!map[t]) map[t] = { count: 0, cost: 0, litres: 0 };
      map[t].count++;
      map[t].cost += Number(l.totalCost || 0);
      map[t].litres += Number(l.liters || 0);
    });
    return Object.entries(map)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.cost - a.cost);
  }, [logs]);

  // Best fill-up (highest km/L)
  const bestLog = useMemo(() => {
    if (sortedLogs.length < 2) return null;
    let best = null;
    let bestEco = 0;
    for (let i = 1; i < sortedLogs.length; i++) {
      const dist = Number(sortedLogs[i].odometer) - Number(sortedLogs[i - 1].odometer);
      const eco = dist / Number(sortedLogs[i].liters);
      if (eco > bestEco) { bestEco = eco; best = { ...sortedLogs[i], economy: eco }; }
    }
    return best;
  }, [sortedLogs]);

  const topStats = [
    {
      label: 'Total Fuel Spend',
      value: formatCurrency(summary.totalCost),
      icon: DollarSign,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Total Maintenance Spend',
      value: formatCurrency(totalMaintenanceCost),
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Total Spend (All)',
      value: formatCurrency(summary.totalCost + totalMaintenanceCost),
      icon: FileText,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      label: 'Avg Monthly Fuel Spend',
      value: formatCurrency(avgMonthlySpend),
      icon: Calendar,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    },
    {
      label: 'Total Distance Covered',
      value: formatNumber(summary.totalDistance, 0, ' km'),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Best Economy',
      value: summary.bestEconomy ? formatNumber(summary.bestEconomy, 2, ' km/L') : '—',
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  if (logs.length === 0) {
    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Reports</h1>
        <Card>
          <EmptyState
            icon={FileText}
            title="No data for reports"
            message="Add fuel logs to generate your spending and efficiency reports."
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Comprehensive overview of your fuel and maintenance spending
        </p>
      </div>

      {/* Top stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topStats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-slate-700/70 dark:bg-slate-800/90 ${bg}`}>
            <div className={`mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Best fill-up */}
      {bestLog && (
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader title="🏆 Best Fill-up" subtitle="Your most fuel-efficient fill-up on record" />
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px]">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatNumber(bestLog.economy, 2, ' km/L')}
              </p>
              <p className="text-sm text-slate-500 mt-1">fuel economy achieved</p>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
              <p>📅 {formatDate(bestLog.date)}</p>
              <p>⛽ {bestLog.station || 'Unknown Station'} · {bestLog.fuelType}</p>
              <p>🛣 {formatNumber(bestLog.odometer, 0, ' km')} odometer</p>
              <p>💰 {formatCurrency(bestLog.totalCost)} ({formatNumber(bestLog.liters, 1, ' L')})</p>
            </div>
          </div>
        </Card>
      )}

      {/* Fuel type breakdown */}
      {fuelTypeBreakdown.length > 0 && (
        <Card>
          <CardHeader title="Fuel Type Breakdown" subtitle="Spending breakdown by fuel type" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['Fuel Type', 'Fill-ups', 'Litres', 'Total Cost', '% of Spend'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {fuelTypeBreakdown.map(({ type, count, litres, cost }) => (
                  <tr key={type} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{type}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{count}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{formatNumber(litres, 1, ' L')}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(cost)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${summary.totalCost > 0 ? (cost / summary.totalCost) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right">
                          {summary.totalCost > 0 ? ((cost / summary.totalCost) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Monthly summary table */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader title="Monthly Summary" subtitle="Month-by-month fuel log overview" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['Month', 'Spending', 'Litres', 'Avg Economy'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {[...monthlyData].reverse().map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{formatMonthLabel(m.month)}</td>
                    <td className="py-3 px-3 font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(m.spending)}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{formatNumber(m.litres, 1, ' L')}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {m.avgEconomy ? formatNumber(m.avgEconomy, 2, ' km/L') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
