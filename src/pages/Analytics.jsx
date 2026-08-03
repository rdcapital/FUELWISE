/**
 * Analytics.jsx
 * Charts and analytics using Recharts.
 *
 * Demonstrates:
 *  - Recharts: BarChart, LineChart, AreaChart
 *  - Data transformation for charts (buildMonthlyData)
 *  - Responsive containers
 *  - Empty states for charts
 */
import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useFuelLogs } from '../hooks/useFuelLogs';
import { buildMonthlyData, computeSummary, getFuelEconomyHint } from '../utils/calculations';
import { formatCurrency, formatNumber, formatMonthLabel } from '../utils/formatters';
import { CHART_COLORS } from '../utils/constants';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { BarChart3, TrendingUp, Fuel, Gauge } from 'lucide-react';

/** Styled Recharts tooltip */
function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{formatMonthLabel(label)}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{formatter ? formatter(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { logs } = useFuelLogs();

  // Sort logs by odometer for correct economy calculations
  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => Number(a.odometer) - Number(b.odometer)),
    [logs]
  );

  // Monthly aggregated data for charts
  const monthlyData = useMemo(() => buildMonthlyData(sortedLogs), [sortedLogs]);

  // Per-fill-up data for cost trend
  const costTrendData = useMemo(
    () =>
      [...logs]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((l, i) => ({
          index: i + 1,
          label: l.station || `Fill-up ${i + 1}`,
          cost: Number(l.totalCost),
          ppl: Number(l.pricePerLiter),
        })),
    [logs]
  );

  const summary = useMemo(() => computeSummary(sortedLogs), [sortedLogs]);
  const economyHint = useMemo(
    () => getFuelEconomyHint(summary.avgEconomy, summary.costPerKm),
    [summary.avgEconomy, summary.costPerKm]
  );

  const hasData = logs.length >= 2;

  const summaryStats = [
    { label: 'Best Economy', value: summary.bestEconomy ? formatNumber(summary.bestEconomy, 2, ' km/L') : '—', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Avg Economy', value: summary.avgEconomy ? formatNumber(summary.avgEconomy, 2, ' km/L') : '—', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Worst Economy', value: summary.worstEconomy ? formatNumber(summary.worstEconomy, 2, ' km/L') : '—', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Total Distance', value: formatNumber(summary.totalDistance, 0, ' km'), color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Visual insights into your fuel habits</p>
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-800 shadow-sm dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
        <p className="font-semibold">Fuel efficiency hint</p>
        <p className="mt-1">{economyHint}</p>
      </div>

      {/* Economy summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/70 dark:border-slate-700/70 dark:bg-slate-800/90 ${bg}`}>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {!hasData ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="Not enough data for charts"
            message="Add at least 2 fuel logs to see analytics and charts."
          />
        </Card>
      ) : (
        <>
          {/* Monthly Spending — BarChart */}
          <Card>
            <CardHeader title="Monthly Fuel Spending" subtitle="Total cost per month" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₵${v}`} />
                <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
                <Bar dataKey="spending" name="Spending" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Fuel Economy Trend — LineChart */}
          <Card>
            <CardHeader title="Fuel Economy Trend" subtitle="Average km/L per month" />
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} km/L`} />
                <Tooltip content={<CustomTooltip formatter={(v) => `${v} km/L`} />} />
                <Line
                  type="monotone"
                  dataKey="avgEconomy"
                  name="Avg Economy"
                  stroke={CHART_COLORS.success}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: CHART_COLORS.success }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Cost per Fill-up — AreaChart */}
          <Card>
            <CardHeader title="Cost per Fill-up" subtitle="Total cost for each individual fill-up" />
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={costTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="index" tick={{ fontSize: 11 }} label={{ value: 'Fill-up #', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₵${v}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3 text-xs">
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{d?.label}</p>
                        <p style={{ color: CHART_COLORS.accent }}>Cost: <strong>{formatCurrency(d?.cost)}</strong></p>
                        <p className="text-slate-500">₵{d?.ppl}/L</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  name="Cost"
                  stroke={CHART_COLORS.accent}
                  strokeWidth={2.5}
                  fill="url(#costGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Litres — BarChart */}
          <Card>
            <CardHeader title="Monthly Litres Purchased" subtitle="Volume of fuel bought per month" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}L`} />
                <Tooltip content={<CustomTooltip formatter={(v) => `${v} L`} />} />
                <Bar dataKey="litres" name="Litres" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
