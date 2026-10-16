"use client";

import { useState, useTransition } from "react";
import { cancelBooking, markCompleted, markNoShow, markPaid } from "@/app/admin/actions";
import { EmptyState } from "@/components/EmptyState";
import { SectionLabel } from "@/components/SectionLabel";
import { useNow } from "@/hooks/useNow";
import { boardSections, greeting, type BoardBooking } from "@/lib/admin-board";
import { formatDayLong } from "@/lib/dates";
import { Stat } from "./bookings/Stat";
import { TodayCard } from "./bookings/TodayCard";
import { UpcomingList } from "./bookings/UpcomingList";
import { WaitingCard } from "./bookings/WaitingCard";

type BookingsBoardProps = {
  bookings: BoardBooking[];
  ownerName: string;
  /** Server time, so the first render matches on server and client. */
  now: string;
  holdHours: number;
};

/** Each button runs a server action; the page then refreshes from the database. */
export function BookingsBoard({ bookings, ownerName, now: initialNow, holdHours }: BookingsBoardProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();
  const hasWaiting = bookings.some((b) => b.status === "pending_deposit");
  // Tick every 30 seconds while a "time left" countdown is on screen.
  const now = useNow(initialNow, { every: 30_000, enabled: hasWaiting });
  const { waiting, today, upcoming } = boardSections(bookings, now);

  function run(action: (id: string) => Promise<boolean>, booking: BoardBooking, message: string) {
    startTransition(async () => {
      const changed = await action(booking.id);
      setNotice(changed ? message : `${booking.client_name}'s booking had already changed, so the page has been updated.`);
    });
  }

  function cancel(booking: BoardBooking) {
    if (window.confirm(`Cancel ${booking.client_name}'s booking? The slot opens up again.`)) {
      run(cancelBooking, booking, `${booking.client_name}'s booking was cancelled.`);
    }
  }

  return (
    <>
      <h1 className="mt-8 font-serif text-title">
        {greeting(now)}, {ownerName}
      </h1>
      <p className="mt-1 text-muted">{formatDayLong(now)}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Today" value={today.filter((b) => b.status === "confirmed").length} unit="bookings" />
        <Stat label="Awaiting deposit" value={waiting.length} unit="to check" />
      </div>

      <p role="status" className="sr-only">
        {notice}
      </p>

      <SectionLabel>Waiting for deposit</SectionLabel>
      {waiting.length === 0 ? (
        <EmptyState>Nothing waiting. Every booking is paid up.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {waiting.map((b) => (
            <WaitingCard
              key={b.id}
              booking={b}
              now={now}
              busy={busy}
              onMarkPaid={() => run(markPaid, b, `${b.client_name}'s booking is confirmed.`)}
              onCancel={() => cancel(b)}
            />
          ))}
        </ul>
      )}

      <SectionLabel>Today</SectionLabel>
      {today.length === 0 ? (
        <EmptyState>No appointments today.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {today.map((b) => (
            <TodayCard
              key={b.id}
              booking={b}
              now={now}
              busy={busy}
              onCompleted={() => run(markCompleted, b, `${b.client_name} marked as completed.`)}
              onNoShow={() => run(markNoShow, b, `${b.client_name} marked as a no-show.`)}
              onCancel={() => cancel(b)}
            />
          ))}
        </ul>
      )}

      <SectionLabel>Upcoming</SectionLabel>
      {upcoming.length === 0 ? (
        <EmptyState>No upcoming appointments yet.</EmptyState>
      ) : (
        <UpcomingList bookings={upcoming} busy={busy} onCancel={cancel} />
      )}

      <p className="mt-10 text-[15px] leading-relaxed text-muted">
        Unpaid bookings cancel themselves after {holdHours} hours and the client is emailed.
      </p>
    </>
  );
}
