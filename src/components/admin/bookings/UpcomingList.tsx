import type { BoardBooking } from "@/lib/admin-board";
import { formatDateKey, formatTime, groupByLondonDay } from "@/lib/dates";

export function UpcomingList({ bookings }: { bookings: BoardBooking[] }) {
  return [...groupByLondonDay(bookings)].map(([day, list]) => (
    <section key={day} aria-label={formatDateKey(day, "long")} className="mb-4">
      <h3 className="font-semibold">{formatDateKey(day)}</h3>
      <ul>
        {list.map((b) => (
          <li key={b.id} className="flex justify-between gap-4 border-b border-line py-3.5">
            <span>
              {formatTime(b.starts_at)} · {b.client_name}
            </span>
            <span className="text-right text-muted">{b.service_name}</span>
          </li>
        ))}
      </ul>
    </section>
  ));
}
