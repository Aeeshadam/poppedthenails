"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { SectionLabel } from "@/components/SectionLabel";
import { useNow } from "@/hooks/useNow";
import { boardSections, greeting, type BoardBooking } from "@/lib/admin-board";
import { formatDayLong } from "@/lib/dates";
import type { BookingStatus } from "@/lib/types";
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

/** UI only: step 6 adds markPaid, cancelBooking and the rest. */
export function BookingsBoard({ bookings: initial, ownerName, now: initialNow, holdHours }: BookingsBoardProps) {
  const [bookings, setBookings] = useState(initial);
  const [notice, setNotice] = useState<string | null>(null);
  const hasWaiting = bookings.some((b) => b.status === "pending_deposit");
  // Tick every 30 seconds while a "time left" countdown is on screen.
  const now = useNow(initialNow, { every: 30_000, enabled: hasWaiting });
  const { waiting, today, upcoming } = boardSections(bookings, now);

  function update(booking: BoardBooking, status: BookingStatus, message: string) {
    setBookings((all) => all.map((b) => (b.id === booking.id ? { ...b, status } : b)));
    setNotice(message);
  }

  function cancel(booking: BoardBooking) {
    if (window.confirm(`Cancel ${booking.client_name}'s booking? The slot opens up again.`)) {
      update(booking, "cancelled", `${booking.client_name}'s booking was cancelled.`);
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
              onMarkPaid={() => update(b, "confirmed", `${b.client_name}'s booking is confirmed.`)}
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
              onCompleted={() => update(b, "completed", `${b.client_name} marked as completed.`)}
              onNoShow={() => update(b, "no_show", `${b.client_name} marked as a no-show.`)}
            />
          ))}
        </ul>
      )}

      <SectionLabel>Upcoming</SectionLabel>
      {upcoming.length === 0 ? (
        <EmptyState>No upcoming appointments yet.</EmptyState>
      ) : (
        <UpcomingList bookings={upcoming} />
      )}

      <p className="mt-10 text-[15px] leading-relaxed text-muted">
        Unpaid bookings cancel themselves after {holdHours} hours and the client is emailed.
      </p>
    </>
  );
}
