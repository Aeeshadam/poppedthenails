
import { addMinutes, londonDateKey, londonHour } from "./dates";
import type { Booking, BookingStatus } from "./types";

/** The fields the board shows. Only she sees them: every admin page checks she is signed in. */
export type BoardBooking = Pick<
  Booking,
  | "id"
  | "reference"
  | "service_name"
  | "deposit_pounds"
  | "duration_min"
  | "starts_at"
  | "client_name"
  | "client_phone"
  | "client_email"
  | "notes"
  | "status"
  | "expires_at"
  | "client_says_paid_at"
>;

export type BoardSections = {
  /** Unpaid, soonest to expire first. */
  waiting: BoardBooking[];
  /** Today's paid, completed and no-show bookings, by start time. */
  today: BoardBooking[];
  /** Paid bookings after today, by start time. */
  upcoming: BoardBooking[];
};

const byStart = (a: BoardBooking, b: BoardBooking) => a.starts_at.localeCompare(b.starts_at);

/** Sorts bookings into the board's three sections. Expired and cancelled ones are left out. */
export function boardSections(bookings: BoardBooking[], now: Date): BoardSections {
  const today = londonDateKey(now);
  const dayOf = (b: BoardBooking) => londonDateKey(b.starts_at);

  return {
    waiting: bookings
      .filter((b) => b.status === "pending_deposit")
      .sort((a, b) => a.expires_at.localeCompare(b.expires_at)),
    today: bookings
      .filter((b) => (b.status === "confirmed" || b.status === "completed" || b.status === "no_show") && dayOf(b) === today)
      .sort(byStart),
    upcoming: bookings.filter((b) => b.status === "confirmed" && dayOf(b) > today).sort(byStart),
  };
}

/** "Morning", "Afternoon" or "Evening", by UK time. */
export function greeting(now: Date): string {
  const hour = londonHour(now);
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

export function hasFinished(booking: Pick<BoardBooking, "starts_at" | "duration_min">, now: Date): boolean {
  return addMinutes(booking.starts_at, booking.duration_min) <= now;
}

/** The status changes she can make from the bookings page. */
export type AdminAction = "mark-paid" | "cancel" | "completed" | "no-show";

const MOVES: Record<AdminAction, { from: BookingStatus[]; to: BookingStatus; afterEnd?: boolean }> = {
  "mark-paid": { from: ["pending_deposit"], to: "confirmed" },
  cancel: { from: ["pending_deposit", "confirmed"], to: "cancelled" },
  completed: { from: ["confirmed"], to: "completed", afterEnd: true },
  "no-show": { from: ["confirmed"], to: "no_show", afterEnd: true },
};

/**
 * The new status if the action is allowed, or null. Completed and no-show are
 * only allowed once the appointment has ended.
 */
export function nextStatus(
  booking: Pick<Booking, "status" | "starts_at" | "duration_min">,
  action: AdminAction,
  now: Date,
): BookingStatus | null {
  const move = MOVES[action];
  if (!move.from.includes(booking.status)) return null;
  if (move.afterEnd && !hasFinished(booking, now)) return null;
  return move.to;
}
