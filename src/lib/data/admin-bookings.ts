import "server-only";
import { nextStatus, type AdminAction, type BoardBooking } from "@/lib/admin-board";
import { londonDateKey, londonToUtc } from "@/lib/dates";
import { isUuid } from "@/lib/params";
import { createServerClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types";

const BOARD_COLUMNS =
  "id, reference, service_name, deposit_pounds, duration_min, starts_at, client_name, client_phone, client_email, notes, status, expires_at, client_says_paid_at";

/** Bookings for the board, from the start of today (UK). */
export async function getBoardBookings(now: Date): Promise<BoardBooking[]> {
  const startOfToday = londonToUtc(londonDateKey(now), "00:00").toISOString();
  const { data, error } = await createServerClient()
    .from("bookings")
    .select(BOARD_COLUMNS)
    .in("status", ["pending_deposit", "confirmed", "completed", "no_show"])
    .gte("starts_at", startOfToday)
    .order("starts_at");
  if (error) throw error;
  return data as BoardBooking[];
}

/**
 * Applies one of her actions if the rules allow it. The update only matches
 * while the booking still has the status it was checked with, so a double
 * click or a second device can't apply a stale change. Returns whether it did.
 */
export async function changeBookingStatus(id: string, action: AdminAction, now: Date): Promise<boolean> {
  if (!isUuid(id)) return false;
  const db = createServerClient();
  const { data: booking, error } = await db
    .from("bookings")
    .select("status, starts_at, duration_min")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!booking) return false;

  const from = booking.status as BookingStatus;
  const to = nextStatus({ ...booking, status: from }, action, now);
  if (!to) return false;

  const stamp = now.toISOString();
  const { data: updated, error: updateError } = await db
    .from("bookings")
    .update({
      status: to,
      ...(to === "confirmed" && { paid_at: stamp }),
      ...(to === "cancelled" && { cancelled_at: stamp }),
    })
    .eq("id", id)
    .eq("status", from)
    .select("id");
  if (updateError) throw updateError;
  return updated.length === 1;
}

/**
 * The sweep: expires unpaid bookings whose hold has ended, unless the client
 * says they've paid. One update, so two sweeps at once can't expire (and
 * email) the same booking twice. Returns what it expired.
 */
export async function expireOverdueBookings(now: Date) {
  const { data, error } = await createServerClient()
    .from("bookings")
    .update({ status: "expired" })
    .eq("status", "pending_deposit")
    .lt("expires_at", now.toISOString())
    .is("client_says_paid_at", null)
    .select("reference, client_name, client_email, service_name, starts_at");
  if (error) throw error;
  return data;
}
