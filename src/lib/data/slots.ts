import "server-only";
import { addMinutes } from "@/lib/dates";
import { isPastNoticeCutoff, openSlots } from "@/lib/booking-rules";
import { isUuid } from "@/lib/params";
import { createServerClient } from "@/lib/supabase/server";
import type { Slot } from "@/lib/types";

const LIVE = ["pending_deposit", "confirmed"];

export async function getOpenSlots(now: Date, minNoticeHours: number): Promise<Slot[]> {
  const db = createServerClient();
  const earliest = addMinutes(now, minNoticeHours * 60).toISOString();
  const [slots, held] = await Promise.all([
    db.from("slots").select("id, starts_at").gt("starts_at", earliest).order("starts_at"),
    db.from("bookings").select("slot_id").in("status", LIVE).gt("starts_at", earliest).not("slot_id", "is", null),
  ]);
  if (slots.error) throw slots.error;
  if (held.error) throw held.error;
  return openSlots(slots.data, new Set(held.data.map((b) => b.slot_id as string)), now, minNoticeHours);
}

/**
 * One slot, if it exists and is past the notice cut-off. Whether someone else
 * holds it is left to the database when the booking is inserted.
 */
export async function findBookableSlot(id: string, now: Date, minNoticeHours: number): Promise<Slot | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await createServerClient().from("slots").select("id, starts_at").eq("id", id).maybeSingle();
  if (error) throw error;
  return data && isPastNoticeCutoff(data.starts_at, now, minNoticeHours) ? data : null;
}
