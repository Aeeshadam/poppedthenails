import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { SectionLabel } from "@/components/SectionLabel";
import { formatDateKey, type DateKey } from "@/lib/dates";
import type { DaySlot } from "@/lib/availability";

type WeekSummaryProps = {
  days: DateKey[];
  slotsOn: (day: DateKey) => DaySlot[];
};

export function WeekSummary({ days, slotsOn }: WeekSummaryProps) {
  const daysWithSlots = days.filter((day) => slotsOn(day).length > 0);

  return (
    <>
      <SectionLabel>Your slots for these days</SectionLabel>
      {daysWithSlots.length === 0 ? (
        <EmptyState>No slots on these days yet.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {daysWithSlots.map((day) => (
            <li key={day}>
              <Card className="p-5">
                <h3 className="text-[17px] font-semibold">{formatDateKey(day)}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {slotsOn(day).map((s) => (
                    <li
                      key={s.starts_at}
                      className={`rounded-full px-3.5 py-1.5 text-[15px] ${
                        s.bookedBy ? "bg-ink text-white" : "bg-soft text-accent-hover"
                      }`}
                    >
                      {s.time}
                      {s.bookedBy && ` · ${s.bookedBy}`}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
