import "server-only";
import type { AdminSlot } from "@/lib/availability";
import { createServerClient } from "@/lib/supabase/server";

const LIVE = ["pending_deposit", "confirmed"];

/** Slots starting in [from, to), with the client's name on any that a live booking holds. */
export async function getSlotsBetween(from: Date, to: Date): Promise<AdminSlot[]> {
  const db = createServerClient();
  const [slots, live] = await Promise.all([
    db.from("slots").select("id, starts_at").gte("starts_at", from.toISOString()).lt("starts_at", to.toISOString()).order("starts_at"),
    db
      .from("bookings")
      .select("slot_id, client_name")
      .in("status", LIVE)
      .gte("starts_at", from.toISOString())
      .lt("starts_at", to.toISOString()),
  ]);
  if (slots.error) throw slots.error;
  if (live.error) throw live.error;
  const bookedBy = new Map(live.data.map((b) => [b.slot_id, b.client_name]));
  return slots.data.map((s) => ({ starts_at: new Date(s.starts_at).toISOString(), bookedBy: bookedBy.get(s.id) ?? null }));
}

/** Adds slots at these UTC start times, skipping any that already exist. */
export async function addSlots(startsAt: string[]): Promise<void> {
  if (startsAt.length === 0) return;
  const { error } = await createServerClient()
    .from("slots")
    .upsert(startsAt.map((starts_at) => ({ starts_at })), { onConflict: "starts_at", ignoreDuplicates: true });
  if (error) throw error;
}

/** Removes the slot at this start time, unless a live booking holds it. Returns whether it did. */
export async function removeOpenSlot(startsAt: string): Promise<boolean> {
  const db = createServerClient();
  const { data: slot, error } = await db.from("slots").select("id").eq("starts_at", startsAt).maybeSingle();
  if (error) throw error;
  if (!slot) return false;

  const { count, error: heldError } = await db
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("slot_id", slot.id)
    .in("status", LIVE);
  if (heldError) throw heldError;
  if (count) return false;

  const { error: deleteError } = await db.from("slots").delete().eq("id", slot.id);
  if (deleteError) throw deleteError;
  return true;
}
