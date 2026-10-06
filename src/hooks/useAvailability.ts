"use client";

import { useState } from "react";
import type { AdminSlot, DaySlot } from "@/components/admin/availability/types";
import { copyWeekForward, GRID_TIMES, slotStart, weekDays } from "@/lib/availability";
import { addDays, formatTime, formatWeekRange, groupByLondonDay, startOfWeek, type DateKey } from "@/lib/dates";

/** UI only: step 7 saves each change with addSlots and removeSlot. */
export function useAvailability(initial: AdminSlot[], today: DateKey) {
  // Slot start (UTC) → client name if booked, null if open.
  const [slots, setSlots] = useState(() => new Map(initial.map((s) => [s.starts_at, s.bookedBy])));
  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const [selectedDay, setSelectedDay] = useState<DateKey>(today);
  const [notice, setNotice] = useState<string | null>(null);

  const days = weekDays(weekStart);
  const slotsByDay = groupByLondonDay(
    [...slots.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([start, bookedBy]): DaySlot => ({ starts_at: start, time: formatTime(start), bookedBy })),
  );
  const slotsOn = (day: DateKey) => slotsByDay.get(day) ?? [];

  const daySlots = slotsOn(selectedDay);
  const daySlotsByTime = new Map(daySlots.map((s) => [s.time, s]));
  // The half-hour grid plus any custom times already on this day.
  const dayTimes = [...new Set([...GRID_TIMES, ...daySlotsByTime.keys()])].sort();

  function changeWeek(by: -1 | 1) {
    const monday = addDays(weekStart, by * 7);
    setWeekStart(monday);
    setSelectedDay(weekDays(monday).includes(today) ? today : monday);
  }

  function addTime(time: string) {
    const start = slotStart(selectedDay, time);
    if (slots.has(start)) return;
    setSlots(new Map(slots).set(start, null));
    setNotice(`Added ${time}.`);
  }

  /** Adds an empty time, removes an open one; booked times are locked. */
  function toggle(time: string) {
    const slot = daySlotsByTime.get(time);
    if (!slot) return addTime(time);
    if (slot.bookedBy) return;
    const next = new Map(slots);
    next.delete(slot.starts_at);
    setSlots(next);
    setNotice(`Removed ${time}.`);
  }

  function copyWeek() {
    const added = copyWeekForward(slots.keys(), weekStart);
    const next = new Map(slots);
    for (const start of added) next.set(start, null);
    setSlots(next);
    setNotice(
      added.length === 0
        ? "Next week already has all of these times."
        : `Copied ${added.length} slot${added.length === 1 ? "" : "s"} to ${formatWeekRange(addDays(weekStart, 7))}.`,
    );
  }

  return {
    days,
    selectedDay,
    selectDay: setSelectedDay,
    isPast: selectedDay < today,
    slotsOn,
    daySlots,
    daySlotsByTime,
    dayTimes,
    notice,
    changeWeek,
    addTime,
    toggle,
    copyWeek,
  };
}
