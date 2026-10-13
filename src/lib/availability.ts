// Rules for her availability: the slot times she can pick. Times are UK
// wall-clock on screen and UTC ISO strings in the data.

import { addDays, londonToUtc, type DateKey } from "./dates";

export type AdminSlot = {
  /** UTC ISO start time. */
  starts_at: string;
  /** Client name if the slot has a live booking. */
  bookedBy: string | null;
};

export type DaySlot = {
  /** UTC ISO start time. */
  starts_at: string;
  /** UK time, e.g. "17:00". */
  time: string;
  /** Client name if the slot has a live booking. */
  bookedBy: string | null;
};


/** Half-hour times from 08:00 to 21:00, the grid she taps on. */
export const GRID_TIMES = Array.from({ length: 27 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});

/** Seven days in a row from a start date. */
export function weekDays(start: DateKey): DateKey[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function slotStart(day: DateKey, time: string): string {
  return londonToUtc(day, time).toISOString();
}
