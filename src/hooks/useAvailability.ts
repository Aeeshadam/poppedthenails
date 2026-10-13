"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addAvailability, removeAvailability } from "@/app/admin/actions";
import { GRID_TIMES, slotStart, weekDays, type AdminSlot, type DaySlot } from "@/lib/availability";
import { addDays, formatTime, groupByLondonDay, type DateKey } from "@/lib/dates";

/**
 * The availability editor's state. The slots come from the server for the week
 * in the URL; each change is saved by a server action, which refreshes them.
 */
export function useAvailability(slots: AdminSlot[], weekStart: DateKey, today: DateKey) {
  const router = useRouter();
  const days = weekDays(weekStart);
  const [selectedDay, setSelectedDay] = useState<DateKey>(weekStart);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, startTransition] = useTransition();

  const slotsByDay = groupByLondonDay(
    [...slots]
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
      .map((s): DaySlot => ({ ...s, time: formatTime(s.starts_at) })),
  );
  const slotsOn = (day: DateKey) => slotsByDay.get(day) ?? [];

  const daySlots = slotsOn(selectedDay);
  const daySlotsByTime = new Map(daySlots.map((s) => [s.time, s]));
  // The half-hour grid plus any custom times already on this day.
  const dayTimes = [...new Set([...GRID_TIMES, ...daySlotsByTime.keys()])].sort();

  function save(work: () => Promise<string>) {
    startTransition(async () => setNotice(await work()));
  }

  function changeWeek(by: -1 | 1) {
    const start = addDays(weekStart, by * 7);
    router.push(`/admin/availability?from=${start < today ? today : start}`);
  }

  function addTime(time: string) {
    if (daySlotsByTime.has(time)) return;
    save(async () => {
      await addAvailability([slotStart(selectedDay, time)]);
      return `Added ${time}.`;
    });
  }

  /** Adds an empty time, removes an open one; booked times are locked. */
  function toggle(time: string) {
    const slot = daySlotsByTime.get(time);
    if (!slot) return addTime(time);
    if (slot.bookedBy) return;
    save(async () =>
      (await removeAvailability(slot.starts_at))
        ? `Removed ${time}.`
        : `${time} has just been booked, so it can't be removed.`,
    );
  }


  return {
    days,
    selectedDay,
    selectDay: setSelectedDay,
    canGoBack: weekStart > today,
    saving,
    slotsOn,
    daySlots,
    daySlotsByTime,
    dayTimes,
    notice,
    changeWeek,
    addTime,
    toggle,
  };
}
