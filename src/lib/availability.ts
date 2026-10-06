// Rules for her availability: the slot times she can pick and copying a week
// forward. Times are UK wall-clock on screen and UTC ISO strings in the data.

import { addDays, formatTime, londonDateKey, londonToUtc, type DateKey } from "./dates";

/** Half-hour times from 08:00 to 21:00, the grid she taps on. */
export const GRID_TIMES = Array.from({ length: 27 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});

export function weekDays(monday: DateKey): DateKey[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function slotStart(day: DateKey, time: string): string {
  return londonToUtc(day, time).toISOString();
}

/**
 * The slots to add so next week has the same UK times as this week. Each time
 * is re-created at the same UK wall-clock time a week later, so a 17:00 slot
 * stays 17:00 across a clock change. Times next week already has are skipped.
 */
export function copyWeekForward(existing: Iterable<string>, monday: DateKey): string[] {
  const have = new Set(existing);
  const thisWeek = new Set(weekDays(monday));
  const added: string[] = [];
  for (const start of have) {
    const day = londonDateKey(start);
    if (!thisWeek.has(day)) continue;
    const next = slotStart(addDays(day, 7), formatTime(start));
    if (!have.has(next) && !added.includes(next)) added.push(next);
  }
  return added.sort();
}
