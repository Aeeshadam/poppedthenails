"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Field, TextInput } from "@/components/Field";
import { useAvailability } from "@/hooks/useAvailability";
import { formatDateKey, type DateKey } from "@/lib/dates";
import { TimeGrid, TimeGridKey } from "./availability/TimeGrid";
import type { AdminSlot } from "./availability/types";
import { WeekStrip } from "./availability/WeekStrip";
import { WeekSummary } from "./availability/WeekSummary";

export type { AdminSlot };

type AvailabilityEditorProps = {
  slots: AdminSlot[];
  today: DateKey;
};

export function AvailabilityEditor({ slots, today }: AvailabilityEditorProps) {
  const availability = useAvailability(slots, today);
  const { selectedDay, daySlots, isPast, notice } = availability;
  const [customTime, setCustomTime] = useState("");

  function addCustom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (customTime) availability.addTime(customTime);
    setCustomTime("");
  }

  return (
    <>
      <h1 className="mt-8 font-serif text-title">Availability</h1>
      <p className="mt-2 leading-relaxed text-muted">
        Add the dates and times you&rsquo;re free. Clients can only book these.
      </p>

      <Card className="mt-6 p-4">
        <WeekStrip
          days={availability.days}
          today={today}
          selectedDay={selectedDay}
          hasSlots={(day) => availability.slotsOn(day).length > 0}
          onSelectDay={availability.selectDay}
          onChangeWeek={availability.changeWeek}
        />

        <div className="mt-6 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-[24px]">{formatDateKey(selectedDay, "long")}</h2>
          <p className="shrink-0 text-[15px] text-muted">
            {daySlots.length} slot{daySlots.length === 1 ? "" : "s"}
          </p>
        </div>
        <p className="mt-1 text-[15px] text-muted">
          {isPast ? "This day has passed." : "Tap a time to add or remove it."}
        </p>

        <TimeGrid
          times={availability.dayTimes}
          slotsByTime={availability.daySlotsByTime}
          disabled={isPast}
          onToggle={availability.toggle}
        />

        {!isPast && (
          <form onSubmit={addCustom} className="mt-4 flex items-end gap-3">
            <Field label="Another time" htmlFor="custom-time" className="flex-1">
              <TextInput
                id="custom-time"
                type="time"
                step={300}
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="secondary" size="field" disabled={!customTime}>
              Add
            </Button>
          </form>
        )}

        <TimeGridKey />

        <Button variant="outline" className="mt-5 w-full" onClick={availability.copyWeek}>
          Copy this week to next week
        </Button>
        <p role="status" className="mt-3 text-center text-[15px] text-muted empty:hidden">
          {notice}
        </p>
      </Card>

      <WeekSummary days={availability.days} slotsOn={availability.slotsOn} />
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Days with no slots aren&rsquo;t shown to clients. Booked slots can&rsquo;t be removed here;
        cancel the booking first.
      </p>
    </>
  );
}
