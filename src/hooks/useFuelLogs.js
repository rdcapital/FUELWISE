/**
 * useFuelLogs.js
 * Custom hook that manages all CRUD operations for fuel log entries.
 * Data is persisted to localStorage via our storage utility.
 *
 * Returns:
 *  - logs        : sorted array of log objects (newest first)
 *  - addLog      : (data) => void
 *  - updateLog   : (id, data) => void
 *  - deleteLog   : (id) => void
 */
import { useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

function loadLogs() {
  return getItem(STORAGE_KEYS.FUEL_LOGS, []);
}

function saveLogs(logs) {
  setItem(STORAGE_KEYS.FUEL_LOGS, logs);
}

export function useFuelLogs() {
  // Initialise from localStorage; useState lazy-initialiser runs only once
  const [logs, setLogs] = useState(loadLogs);

  /** Add a new log entry.  Auto-generates an id and timestamp. */
  const addLog = useCallback((data) => {
    const newLog = {
      ...data,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      // Ensure numeric fields are stored as numbers
      odometer: Number(data.odometer),
      liters: Number(data.liters),
      pricePerLiter: Number(data.pricePerLiter),
      totalCost: Number(data.totalCost),
    };
    setLogs((prev) => {
      const updated = [newLog, ...prev];
      saveLogs(updated);
      return updated;
    });
  }, []);

  /** Replace a log entry by id */
  const updateLog = useCallback((id, data) => {
    setLogs((prev) => {
      const updated = prev.map((l) =>
        l.id === id
          ? {
              ...l,
              ...data,
              odometer: Number(data.odometer),
              liters: Number(data.liters),
              pricePerLiter: Number(data.pricePerLiter),
              totalCost: Number(data.totalCost),
            }
          : l
      );
      saveLogs(updated);
      return updated;
    });
  }, []);

  /** Remove a log entry by id */
  const deleteLog = useCallback((id) => {
    setLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveLogs(updated);
      return updated;
    });
  }, []);

  return { logs, addLog, updateLog, deleteLog };
}
