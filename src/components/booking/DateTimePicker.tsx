"use client";

import { DayPicker } from "@daypicker/react";
import { enGB } from "@daypicker/react/locale";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import {
  calendarDate,
  calendarDayKey,
  formatDateKey,
  formatDayShort,
  formatTime,
  groupByLondonDay,
  londonDateKey,
  type DateKey,
} from "@/lib/dates";
import type { Slot } from "@/lib/types";
import { BottomBar } from "./BottomBar";

type DateTimePickerProps = {
  serviceId: string;
  serviceLabel: string;
  /** Open slots only, sorted by time. */
  slots: Slot[];
  initialSlotId?: string;
  /** Today in the UK, from the server, so server and browser agree on "today". */
  today: DateKey;
};

const roundButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface hover:border-accent focus-visible:outline-2 focus-visible:outline-accent aria-disabled:pointer-events-none aria-disabled:opacity-30";

/**
 * Month calendar styled to the design. Days are plain calendar days: slots are
 * matched to them by their UK date key, so the visitor's own time zone never
 * moves a slot to another day.
 */
const calendarClassNames = {
  month: "grid grid-cols-[44px_1fr_44px] items-center gap-y-4",
  month_caption: "flex justify-center",
  caption_label: "font-serif text-card-title",
  button_previous: roundButton,
  button_next: roundButton,
  month_grid: "col-span-3 w-full table-fixed border-collapse",
  weekday: "pb-2 text-[13px] font-medium text-muted",
  day: "group p-0 text-center",
  day_button:
    "mx-auto flex size-10 items-center justify-center rounded-full bg-soft text-[15px] font-medium transition-colors hover:bg-lilac focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-data-[selected=true]:bg-accent group-data-[selected=true]:text-white",
  // Days with no open times: crossed out and not clickable.
  disabled: "[&>button]:bg-transparent [&>button]:text-muted/45 [&>button]:line-through [&>button]:hover:bg-transparent",
};

export function DateTimePicker({ serviceId, serviceLabel, slots, initialSlotId, today }: DateTimePickerProps) {
  const slotsByDay = groupByLondonDay(slots);
  const days = [...slotsByDay.keys()];
  const initialSlot = slots.find((s) => s.id === initialSlotId);
  const initialDay = initialSlot ? londonDateKey(initialSlot.starts_at) : days[0];

  const [selectedDay, setSelectedDay] = useState<DateKey | undefined>(initialDay);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(initialSlot?.id);

  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  if (!firstDay || !lastDay) {
    return (
      <EmptyState className="mt-8">
        There are no open times right now. New times are added often, so please check back soon.
      </EmptyState>
    );
  }

  const daySlots = selectedDay ? (slotsByDay.get(selectedDay) ?? []) : [];
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  function pickDay(date: Date | undefined) {
    if (!date) return;
    setSelectedDay(calendarDayKey(date));
    setSelectedSlotId(undefined);
  }

  return (
    <form action="/book/details" method="get">
      <input type="hidden" name="service" value={serviceId} />

      <Card className="mt-6 p-4">
        <DayPicker
          mode="single"
          required
          locale={enGB}
          today={calendarDate(today)}
          weekStartsOn={1}
          navLayout="around"
          selected={selectedDay ? calendarDate(selectedDay) : undefined}
          onSelect={pickDay}
          defaultMonth={calendarDate(selectedDay ?? firstDay)}
          startMonth={calendarDate(firstDay)}
          endMonth={calendarDate(lastDay)}
          disabled={(date) => !slotsByDay.has(calendarDayKey(date))}
          formatters={{ formatWeekdayName: (date) => date.toLocaleDateString("en-GB", { weekday: "narrow" }) }}
          components={{
            Chevron: ({ orientation }) => (orientation === "left" ? <ChevronLeft /> : <ChevronRight />),
          }}
          classNames={calendarClassNames}
        />
      </Card>

      {selectedDay && (
        <fieldset className="mt-6">
          <legend className="text-[17px] font-semibold">{formatDateKey(selectedDay, "long")}</legend>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {daySlots.map((slot) => {
              const checked = slot.id === selectedSlotId;
              return (
                <label
                  key={slot.id}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-input border text-base transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    checked ? "border-accent bg-accent font-semibold text-white" : "border-line bg-surface hover:border-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    checked={checked}
                    onChange={() => setSelectedSlotId(slot.id)}
                    className="sr-only"
                    required
                  />
                  {formatTime(slot.starts_at)}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <BottomBar>
        <div className="min-w-0" aria-live="polite">
          {selectedSlot ? (
            <p className="font-semibold">
              {formatDayShort(selectedSlot.starts_at)} · {formatTime(selectedSlot.starts_at)}
            </p>
          ) : (
            <p className="font-semibold">Pick a time</p>
          )}
          <p className="truncate text-sm text-muted">{serviceLabel}</p>
        </div>
        <Button type="submit" disabled={!selectedSlot} className="shrink-0">
          Continue
        </Button>
      </BottomBar>
    </form>
  );
}
