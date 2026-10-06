// Booking rules from docs/SPEC.md ("Booking flow and slot rules"). Step 5 adds
// the rest here (open slots, the 24-hour cut-off, expiry) with tests.

import type { BookingStatus } from "./types";

/** Only pending and confirmed bookings hold a slot; the others free it up. */
export function holdsSlot(status: BookingStatus): boolean {
  return status === "pending_deposit" || status === "confirmed";
}
