// Everything is stored in UTC and shown in UK time. date-fns and @date-fns/tz
// do the date maths and UK conversion (clock changes included); the browser's
// Intl formats dates for display.

import { TZDate } from "@date-fns/tz";
import {
  addDays as addDaysToDate,
  addMinutes as addMinutesToDate,
  differenceInMilliseconds,
  format,
  getISODay,
  parseISO,
  startOfISOWeek,
} from "date-fns";

const TIME_ZONE = "Europe/London";

/** A calendar day in UK time, as "YYYY-MM-DD". */
export type DateKey = string;

const DATE_KEY = "yyyy-MM-dd";

function formatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, ...options });
}

const timeFormat = formatter({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const dayLongFormat = formatter({ weekday: "long", day: "numeric", month: "long" });
const dayShortFormat = formatter({ weekday: "short", day: "numeric", month: "short" });
const monthNameFormat = new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" });

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** "12:30" */
export function formatTime(date: Date | string): string {
  return timeFormat.format(new Date(date));
}

/** "Friday 9 October" */
export function formatDayLong(date: Date | string): string {
  return dayLongFormat.format(new Date(date));
}

/** "Fri 9 Oct" */
export function formatDayShort(date: Date | string): string {
  return dayShortFormat.format(new Date(date));
}

/** Format a date key directly (no time zone shift), e.g. "Fri 9 Oct". */
export function formatDateKey(dateKey: DateKey, style: "long" | "short" = "short"): string {
  // Midday UTC is the same calendar day in the UK all year round.
  const noon = new Date(`${dateKey}T12:00:00Z`);
  return style === "long" ? formatDayLong(noon) : formatDayShort(noon);
}

/** "5 – 11 October", or "28 September – 4 October" when the week spans two months. */
export function formatWeekRange(monday: DateKey): string {
  const sunday = addDays(monday, 6);
  const month = (key: DateKey) => monthNameFormat.format(new Date(`${key}T12:00:00Z`));
  return month(monday) === month(sunday)
    ? `${dayOfMonth(monday)} – ${dayOfMonth(sunday)} ${month(sunday)}`
    : `${dayOfMonth(monday)} ${month(monday)} – ${dayOfMonth(sunday)} ${month(sunday)}`;
}

/** "1 h 40 min left", "25 min left", or "Time's up". */
export function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "Time's up";
  const totalMinutes = Math.ceil(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min left`;
  if (minutes === 0) return `${hours} h left`;
  return `${hours} h ${minutes} min left`;
}

/** The UK calendar day an instant falls on, e.g. "2026-10-09". */
export function londonDateKey(date: Date | string): DateKey {
  return format(new TZDate(new Date(date), TIME_ZONE), DATE_KEY);
}

export function londonHour(date: Date | string): number {
  return new TZDate(new Date(date), TIME_ZONE).getHours();
}

/** The instant of a UK date and time, e.g. ("2026-10-10", "17:00"). Handles both clock changes. */
export function londonToUtc(dateKey: DateKey, time: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number) as [number, number, number];
  const [hour, minute] = time.split(":").map(Number) as [number, number];
  return new Date(new TZDate(year, month - 1, day, hour, minute, 0, TIME_ZONE).getTime());
}

export function groupByLondonDay<T extends { starts_at: string }>(items: T[]): Map<DateKey, T[]> {
  const groups = new Map<DateKey, T[]>();
  for (const item of items) {
    const day = londonDateKey(item.starts_at);
    const group = groups.get(day);
    if (group) group.push(item);
    else groups.set(day, [item]);
  }
  return groups;
}

export function addMinutes(date: Date | string, minutes: number): Date {
  return addMinutesToDate(new Date(date), minutes);
}

/** Milliseconds from now until a time; negative once it has passed. */
export function msUntil(date: Date | string, now: Date): number {
  return differenceInMilliseconds(new Date(date), now);
}

export function addDays(dateKey: DateKey, days: number): DateKey {
  return format(addDaysToDate(parseISO(dateKey), days), DATE_KEY);
}

/** Day of the week for a date key, Monday = 0 … Sunday = 6. */
export function weekdayIndex(dateKey: DateKey): number {
  return getISODay(parseISO(dateKey)) - 1;
}

export function startOfWeek(dateKey: DateKey): DateKey {
  return format(startOfISOWeek(parseISO(dateKey)), DATE_KEY);
}

export function dayOfMonth(dateKey: DateKey): number {
  return Number(dateKey.slice(8, 10));
}

/**
 * A calendar widget's day (a local Date at midnight) as a date key, using only
 * its year, month and day, so it's the same key in any browser time zone.
 */
export function calendarDayKey(date: Date): DateKey {
  return format(date, DATE_KEY);
}

export function calendarDate(dateKey: DateKey): Date {
  return parseISO(dateKey);
}
