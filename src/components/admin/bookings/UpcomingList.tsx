import { Card } from "@/components/Card";
import type { BoardBooking } from "@/lib/admin-board";
import { formatDateKey, formatTime, groupByLondonDay } from "@/lib/dates";
import { ClientContact } from "./ClientContact";

export function UpcomingList({ bookings }: { bookings: BoardBooking[] }) {
  return [...groupByLondonDay(bookings)].map(([day, list]) => (
    <section key={day} aria-label={formatDateKey(day, "long")} className="mb-5">
      <h3 className="mb-2 font-semibold">{formatDateKey(day)}</h3>
      <ul className="grid gap-3">
        {list.map((b) => (
          <li key={b.id}>
            <Card className="flex gap-4 p-5">
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
            </Card>
          </li>
        ))}
      </ul>
    </section>
  ));
}
