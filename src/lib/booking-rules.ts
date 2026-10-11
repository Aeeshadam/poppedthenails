import { addMinutes, msUntil } from "./dates";
import type { BookingStatus, Service } from "./types";

/** Only pending and confirmed bookings hold a slot; the others free it up. */
export function holdsSlot(status: BookingStatus): boolean {
  return status === "pending_deposit" || status === "confirmed";
}

/** Clients can book up to the minimum notice before a slot (24 hours by default), not later. */
export function isPastNoticeCutoff(startsAt: string, now: Date, minNoticeHours: number): boolean {
  return msUntil(startsAt, now) > minNoticeHours * 60 * 60_000;
}

export function openSlots<T extends { id: string; starts_at: string }>(
  slots: T[],
  heldSlotIds: ReadonlySet<string>,
  now: Date,
  minNoticeHours: number,
): T[] {
  return slots.filter((s) => !heldSlotIds.has(s.id) && isPastNoticeCutoff(s.starts_at, now, minNoticeHours));
}

export function holdExpiresAt(now: Date, holdHours: number): Date {
  return addMinutes(now, holdHours * 60);
}

/** The deposit to quote on the home, /book and terms pages: the lowest in use (£5 by default). */
export function quotedDeposit(services: Pick<Service, "deposit_pounds">[]): number {
  return services.length === 0 ? 5 : Math.min(...services.map((s) => s.deposit_pounds));
}
