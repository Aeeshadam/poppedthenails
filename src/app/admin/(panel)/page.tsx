import { BookingsBoard } from "@/components/admin/BookingsBoard";
import { requireAdmin } from "@/lib/auth";
import { business } from "@/lib/content";
import { getBoardBookings } from "@/lib/data/admin-bookings";
import { getPublicSettings } from "@/lib/data/settings";
import { requestTime } from "@/lib/request-time";

export default async function AdminBookingsPage() {
  await requireAdmin();
  const now = await requestTime();
  const [bookings, settings] = await Promise.all([getBoardBookings(now), getPublicSettings()]);

  return (
    <BookingsBoard
      bookings={bookings}
      ownerName={business.ownerName}
      now={now.toISOString()}
      holdHours={settings.hold_hours}
    />
  );
}
