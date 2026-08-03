/**
 * useMaintenance.js
 * Custom hook for maintenance record CRUD + upcoming reminder logic.
 *
 * Returns:
 *  - records        : all maintenance records
 *  - addRecord      : (data) => void
 *  - updateRecord   : (id, data) => void
 *  - deleteRecord   : (id) => void
 *  - getReminders   : (currentOdometer) => [{type, dueKm, overdue}]
 */
import { useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS, MAINTENANCE_TYPES } from '../utils/constants';

function loadRecords() {
  return getItem(STORAGE_KEYS.MAINTENANCE, []);
}

function saveRecords(records) {
  setItem(STORAGE_KEYS.MAINTENANCE, records);
}

export function useMaintenance() {
  const [records, setRecords] = useState(loadRecords);

  const addRecord = useCallback((data) => {
    const newRecord = {
      ...data,
      id: `maint_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      odometer: Number(data.odometer),
      cost: Number(data.cost || 0),
    };
    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      saveRecords(updated);
      return updated;
    });
  }, []);

  const updateRecord = useCallback((id, data) => {
    setRecords((prev) => {
      const updated = prev.map((r) =>
        r.id === id
          ? { ...r, ...data, odometer: Number(data.odometer), cost: Number(data.cost || 0) }
          : r
      );
      saveRecords(updated);
      return updated;
    });
  }, []);

  const deleteRecord = useCallback((id) => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveRecords(updated);
      return updated;
    });
  }, []);

  /**
   * For each maintenance type with a non-zero interval, find the most recent
   * record of that type and compute the next due odometer.
   */
  const getReminders = useCallback(
    (currentOdometer) => {
      return MAINTENANCE_TYPES.filter((t) => t.intervalKm > 0).map((type) => {
        // Find the most-recent record for this type (highest odometer)
        const typeRecords = records
          .filter((r) => r.type === type.value)
          .sort((a, b) => b.odometer - a.odometer);

        const lastDoneAt = typeRecords[0]?.odometer ?? null;
        const dueAt = lastDoneAt !== null ? lastDoneAt + type.intervalKm : null;
        const overdue = dueAt !== null && currentOdometer >= dueAt;
        const upcoming =
          dueAt !== null && !overdue && dueAt - currentOdometer <= type.intervalKm * 0.2;

        return {
          ...type,
          lastDoneAt,
          dueAt,
          overdue,
          upcoming,
          neverDone: lastDoneAt === null,
        };
      });
    },
    [records]
  );

  return { records, addRecord, updateRecord, deleteRecord, getReminders };
}
