import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { BoardBooking } from "@/lib/admin-board";
import { formatDateKey, formatTime, groupByLondonDay } from "@/lib/dates";
import { ClientContact } from "./ClientContact";

type UpcomingListProps = {
  bookings: BoardBooking[];
  /** True while a change is being saved. */
  busy?: boolean;
  onCancel: (booking: BoardBooking) => void;
};

export function UpcomingList({ bookings, busy, onCancel }: UpcomingListProps) {
  return [...groupByLondonDay(bookings)].map(([day, list]) => (
    <section key={day} aria-label={formatDateKey(day, "long")} className="mb-5">
      <h3 className="mb-2 font-semibold">{formatDateKey(day)}</h3>
      <ul className="grid gap-3">
        {list.map((b) => (
          <li key={b.id}>
            <Card className="p-5">
              <div className="flex gap-4">
                <div className="w-14 shrink-0">
                  <p className="text-xl font-semibold">{formatTime(b.starts_at)}</p>
                  <p className="text-sm text-muted">{b.duration_min}m</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold">{b.client_name}</p>
                  <p className="text-[15px] text-muted">
                    {b.service_name}
                    {b.notes && <> · &ldquo;{b.notes}&rdquo;</>}
                  </p>
                  <ClientContact phone={b.client_phone} email={b.client_email} />
                </div>
              </div>
              <Button size="md" variant="secondary" className="mt-4 w-full" onClick={() => onCancel(b)} disabled={busy}>
                Cancel
              </Button>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  ));
}
