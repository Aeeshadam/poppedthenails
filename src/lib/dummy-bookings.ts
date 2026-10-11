// Dummy slots and bookings for the admin screens, generated relative to "now",
// until steps 6 and 7 read them from Supabase.

import { addDays, addMinutes, londonDateKey, londonToUtc, weekdayIndex, type DateKey } from "./dates";
import { services, settings } from "./dummy";
import { holdsSlot } from "./booking-rules";
import type { Booking, Slot } from "./types";

/** Her usual pattern: weekday evenings, weekend daytimes, Wednesdays off. */
function timesFor(dateKey: DateKey): string[] {
  const day = weekdayIndex(dateKey);
  if (day === 2) return [];
  if (day === 5) return ["10:00", "12:00", "14:00", "16:00"];
  if (day === 6) return ["11:00", "13:00"];
  return ["17:00", "18:30"];
}

function slotId(startsAt: Date): string {
  return `slot-${startsAt.toISOString()}`;
}

type DummyBookingSpec = {
  token: string;
  reference: string;
  name: string;
  serviceId: string;
  dayOffset: number;
  time: string;
  status: Booking["status"];
  /** For pending bookings: minutes until the hold runs out. */
  minutesLeft?: number;
  saysPaid?: boolean;
  notes?: string;
};

const bookingSpecs: DummyBookingSpec[] = [
  { token: "demo-pending", reference: "POP-1234", name: "Priya K.", serviceId: "acrylic", dayOffset: 2, time: "15:15", status: "pending_deposit", minutesLeft: 100 },
  { token: "demo-says-paid", reference: "POP-1237", name: "Maya S.", serviceId: "gel", dayOffset: 4, time: "10:00", status: "pending_deposit", minutesLeft: 25, saysPaid: true },
  { token: "demo-today-1", reference: "POP-1229", name: "Amara O.", serviceId: "gel", dayOffset: 0, time: "10:00", status: "confirmed" },
  { token: "demo-today-2", reference: "POP-1231", name: "Jess T.", serviceId: "biab", dayOffset: 0, time: "12:30", status: "confirmed", notes: "Milky pink pls" },
  { token: "demo-confirmed", reference: "POP-1232", name: "Leah M.", serviceId: "biab-infill", dayOffset: 1, time: "09:30", status: "confirmed" },
  { token: "demo-upcoming", reference: "POP-1233", name: "Chloe R.", serviceId: "art", dayOffset: 1, time: "11:00", status: "confirmed" },
  { token: "demo-expired", reference: "POP-1227", name: "Sam W.", serviceId: "gel", dayOffset: 3, time: "17:00", status: "expired" },
  { token: "demo-cancelled", reference: "POP-1228", name: "Ola B.", serviceId: "biab", dayOffset: 5, time: "18:30", status: "cancelled" },
];

export type DummyData = { slots: Slot[]; bookings: Booking[] };

export function buildDummyData(now: Date): DummyData {
  const today = londonDateKey(now);
  const slots = new Map<string, Slot>();

  const addSlot = (startsAt: Date) => {
    const slot = { id: slotId(startsAt), starts_at: startsAt.toISOString() };
    slots.set(slot.id, slot);
    return slot;
  };

  // Five weeks of her usual pattern, starting from the Monday of this week.
  for (let i = -weekdayIndex(today); i < 35; i++) {
    const day = addDays(today, i);
    for (const time of timesFor(day)) addSlot(londonToUtc(day, time));
  }

  const bookings = bookingSpecs.map((spec, i): Booking => {
    const service = services.find((s) => s.id === spec.serviceId) ?? services[0]!;
    const startsAt = londonToUtc(addDays(today, spec.dayOffset), spec.time);
    const slot = addSlot(startsAt);
    const pending = spec.status === "pending_deposit";
    const expiresAt = pending
      ? addMinutes(now, spec.minutesLeft ?? 120)
      : addMinutes(startsAt, -48 * 60);
    const createdAt = addMinutes(expiresAt, -settings.hold_hours * 60);

    return {
      id: `booking-${i + 1}`,
      token: spec.token,
      reference: spec.reference,
      slot_id: slot.id,
      service_id: service.id,
      service_name: service.name,
      price_pounds: service.price_pounds,
      deposit_pounds: service.deposit_pounds,
      duration_min: service.duration_min,
      starts_at: startsAt.toISOString(),
      client_name: spec.name,
      client_email: "client@example.com",
      client_phone: "07700 900000",
      notes: spec.notes ?? null,
      status: spec.status,
      expires_at: expiresAt.toISOString(),
      client_says_paid_at: spec.saysPaid ? now.toISOString() : null,
      paid_at: spec.status === "confirmed" ? createdAt.toISOString() : null,
      cancelled_at: spec.status === "cancelled" ? createdAt.toISOString() : null,
      reminder_sent_at: null,
      created_at: createdAt.toISOString(),
    };
  });

  const sorted = [...slots.values()].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  return { slots: sorted, bookings };
}

export function liveBookingsBySlot({ bookings }: DummyData): Map<string, Booking> {
  const live = new Map<string, Booking>();
  for (const b of bookings) {
    if (b.slot_id && holdsSlot(b.status)) live.set(b.slot_id, b);
  }
  return live;
}
