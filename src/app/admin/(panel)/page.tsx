import { BookingsBoard } from "@/components/admin/BookingsBoard";
import type { BoardBooking } from "@/lib/admin-board";
import { business } from "@/lib/content";
import { settings } from "@/lib/dummy";
import { buildDummyData } from "@/lib/dummy-bookings";
import type { BookingStatus } from "@/lib/types";
import { requestTime } from "@/lib/request-time";

/** Statuses the board shows; expired and cancelled bookings are left out. */
const SHOWN: BookingStatus[] = ["pending_deposit", "confirmed", "completed", "no_show"];

export default async function AdminBookingsPage() {
  const now = await requestTime();
  const bookings: BoardBooking[] = buildDummyData(now)
    .bookings.filter((b) => SHOWN.includes(b.status))
    .map((b) => ({
      id: b.id,
      reference: b.reference,
      service_name: b.service_name,
      deposit_pounds: b.deposit_pounds,
      duration_min: b.duration_min,
      starts_at: b.starts_at,
      client_name: b.client_name,
      notes: b.notes,
      status: b.status,
      expires_at: b.expires_at,
      client_says_paid_at: b.client_says_paid_at,
    }));

  return (
    <BookingsBoard
      bookings={bookings}
      ownerName={business.ownerName}
      now={now.toISOString()}
      holdHours={settings.hold_hours}
    />
  );
}
