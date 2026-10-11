import { requireAdmin } from "@/lib/auth";
import { AvailabilityEditor, type AdminSlot } from "@/components/admin/AvailabilityEditor";
import { londonDateKey } from "@/lib/dates";
import { buildDummyData, liveBookingsBySlot } from "@/lib/dummy-bookings";
import { requestTime } from "@/lib/request-time";

export default async function AdminAvailabilityPage() {
  await requireAdmin();
  const now = await requestTime();
  const data = buildDummyData(now);
  const live = liveBookingsBySlot(data);
  const slots: AdminSlot[] = data.slots.map((s) => ({
    starts_at: s.starts_at,
    bookedBy: live.get(s.id)?.client_name ?? null,
  }));

  return <AvailabilityEditor slots={slots} today={londonDateKey(now)} />;
}
