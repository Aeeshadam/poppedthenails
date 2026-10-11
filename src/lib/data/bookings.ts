import "server-only";
import { isUuid } from "@/lib/params";
import { createServerClient } from "@/lib/supabase/server";
import type { Booking } from "@/lib/types";

export async function getBookingByToken(token: string): Promise<Booking | null> {
  if (!isUuid(token)) return null;
  const { data, error } = await createServerClient().from("bookings").select("*").eq("token", token).maybeSingle();
  if (error) throw error;
  return data as Booking | null;
}

export async function countBookingsSince(email: string, since: Date): Promise<number> {
  const { count, error } = await createServerClient()
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("client_email", email)
    .gte("created_at", since.toISOString());
  if (error) throw error;
  return count ?? 0;
}

/** A new booking. The database fills in its id, token, reference (POP-1001…) and created_at. */
export type NewBooking = Omit<
  Booking,
  "id" | "token" | "reference" | "created_at" | "client_says_paid_at" | "paid_at" | "cancelled_at" | "reminder_sent_at"
>;

/**
 * Adds a booking and returns its token, or null if the slot was taken first:
 * the one_live_booking_per_slot index lets only one live booking per slot in,
 * even if two people submit at the same moment.
 */
export async function insertBooking(booking: NewBooking): Promise<string | null> {
  const { data, error } = await createServerClient().from("bookings").insert(booking).select("token").single();
  if (!error) return data.token;
  if (error.code === "23505" && error.message.includes("one_live_booking_per_slot")) return null;
  throw error;
}

/** "I've sent it": only on an unpaid booking, and only once. */
export async function markClientSaysPaid(token: string, now: Date): Promise<void> {
  if (!isUuid(token)) return;
  const { error } = await createServerClient()
    .from("bookings")
    .update({ client_says_paid_at: now.toISOString() })
    .eq("token", token)
    .eq("status", "pending_deposit")
    .is("client_says_paid_at", null);
  if (error) throw error;
}
