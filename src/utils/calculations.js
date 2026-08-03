/**
 * calculations.js
 * Pure functions for fuel-economy and cost calculations.
 * Keeping business logic here (separate from components) makes it easy to
 * unit-test and reuse across multiple pages.
 */

/**
 * Compute fuel economy (km per litre) for a fill-up.
 * Requires at least two consecutive logs sorted by odometer ASC.
 *
 * @param {number} currentOdo  - Odometer at this fill-up
 * @param {number} previousOdo - Odometer at the previous fill-up
 * @param {number} litres      - Litres purchased at this fill-up
 * @returns {number|null}  km/L, or null when the inputs are invalid
 */
export function calcEconomy(currentOdo, previousOdo, litres) {
  const distance = currentOdo - previousOdo;
  if (distance <= 0 || litres <= 0) return null;
  return distance / litres;
}

/**
 * Given an array of fuel logs (each with .odometer, .liters, .totalCost),
 * return a summary object used by the Dashboard and Reports pages.
 *
 * Logs must be sorted by odometer ASC before being passed in.
 */
export function computeSummary(logs) {
  if (!logs || logs.length === 0) {
    return {
      totalLitres: 0,
      totalCost: 0,
      totalDistance: 0,
      avgEconomy: null,
      costPerKm: null,
      bestEconomy: null,
      worstEconomy: null,
    };
  }

  // Total litres and cost are simple sums
  const totalLitres = logs.reduce((s, l) => s + Number(l.liters || 0), 0);
  const totalCost = logs.reduce((s, l) => s + Number(l.totalCost || 0), 0);

  // Total distance = max odo - min odo (needs at least 2 logs)
  const sorted = [...logs].sort((a, b) => Number(a.odometer) - Number(b.odometer));
  const totalDistance =
    sorted.length >= 2
      ? Number(sorted[sorted.length - 1].odometer) - Number(sorted[0].odometer)
      : 0;

  // Per-fill-up economies
  const economies = [];
  for (let i = 1; i < sorted.length; i++) {
    const eco = calcEconomy(
      Number(sorted[i].odometer),
      Number(sorted[i - 1].odometer),
      Number(sorted[i].liters)
    );
    if (eco !== null) economies.push(eco);
  }

  const avgEconomy =
    economies.length > 0 ? economies.reduce((s, e) => s + e, 0) / economies.length : null;
  const bestEconomy = economies.length > 0 ? Math.max(...economies) : null;
  const worstEconomy = economies.length > 0 ? Math.min(...economies) : null;
  const costPerKm = totalDistance > 0 ? totalCost / totalDistance : null;

  return {
    totalLitres,
    totalCost,
    totalDistance,
    avgEconomy,
    costPerKm,
    bestEconomy,
    worstEconomy,
  };
}

/**
 * Estimate remaining driving range.
 * @param {number} avgEconomy - km/L
 * @param {number} tankCapacity - litres (full tank)
 * @returns {number} estimated km remaining
 */
export function estimatedRange(avgEconomy, tankCapacity) {
  if (!avgEconomy || !tankCapacity) return 0;
  return avgEconomy * tankCapacity;
}

/**
 * Return a simple human-readable hint about fuel efficiency.
 * @param {number|null} avgEconomy - average km/L across fill-ups
 * @param {number|null} costPerKm - cost per kilometer
 * @returns {string}
 */
export function getFuelEconomyHint(avgEconomy, costPerKm) {
  if (!avgEconomy || avgEconomy <= 0) {
    return 'Add a few more fuel logs to get a clearer fuel-economy trend.';
  }

  if (avgEconomy >= 12) {
    return 'Your fuel economy looks healthy. Keep up the good maintenance and driving habits.';
  }

  if (avgEconomy >= 8) {
    return 'Your fuel economy is average. Small improvements in driving habits or maintenance could help.';
  }

  if (avgEconomy >= 5) {
    return 'Your fuel economy is a bit low. It may be worth checking maintenance, tire pressure, or driving habits.';
  }

  if (costPerKm && costPerKm > 4) {
    return 'Your fuel economy looks poor and your cost per kilometer is high. Please review the log entries and vehicle condition.';
  }

  return 'Your fuel economy looks poor. It may be worth checking the vehicle and the recent log entries carefully.';
}

/**
 * Build a monthly aggregation array for charts.
 * Returns [{month, spending, litres, avgEconomy}] sorted chronologically.
 */
export function buildMonthlyData(logs) {
  const map = {};
  const sorted = [...logs].sort((a, b) => Number(a.odometer) - Number(b.odometer));

  sorted.forEach((log, i) => {
    const date = new Date(log.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!map[key]) {
      map[key] = { month: key, spending: 0, litres: 0, economies: [] };
    }
    map[key].spending += Number(log.totalCost || 0);
    map[key].litres += Number(log.liters || 0);

    if (i > 0) {
      const eco = calcEconomy(
        Number(log.odometer),
        Number(sorted[i - 1].odometer),
        Number(log.liters)
      );
      if (eco !== null) map[key].economies.push(eco);
    }
  });

  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ economies, ...rest }) => ({
      ...rest,
      avgEconomy:
        economies.length > 0
          ? Number((economies.reduce((s, e) => s + e, 0) / economies.length).toFixed(2))
          : null,
    }));
}
