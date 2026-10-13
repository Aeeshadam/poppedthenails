import { AvailabilityEditor } from "@/components/admin/AvailabilityEditor";
import { requireAdmin } from "@/lib/auth";
import { getSlotsBetween } from "@/lib/data/admin-slots";
import { addDays, londonDateKey, londonToUtc } from "@/lib/dates";
import { firstParam } from "@/lib/params";
import { requestTime } from "@/lib/request-time";

export default async function AdminAvailabilityPage({ searchParams }: PageProps<"/admin/availability">) {
  await requireAdmin();
  const now = await requestTime();
  const today = londonDateKey(now);
  // Seven days from ?from=, never earlier than today, so past days are never shown.
  const from = firstParam((await searchParams).from);
  const start = from && /^\d{4}-\d{2}-\d{2}$/.test(from) && from > today ? from : today;

  const slots = await getSlotsBetween(londonToUtc(start, "00:00"), londonToUtc(addDays(start, 7), "00:00"));

  return <AvailabilityEditor key={start} slots={slots} weekStart={start} today={today} />;
}
