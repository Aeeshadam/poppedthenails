// Runs against the real database (npm run test:db) and removes what it adds.
import { afterAll, describe, expect, it } from "vitest";
import { createServerClient } from "@/lib/supabase/server";
import { changeBookingStatus, expireOverdueBookings } from "./admin-bookings";
import { insertBooking } from "./bookings";
import { getOpenSlots } from "./slots";

const db = createServerClient();
const TEST_EMAIL = "admin-db-test@example.com";

afterAll(async () => {
  await db.from("bookings").delete().eq("client_email", TEST_EMAIL);
});

async function newBooking() {
  const [slot] = await getOpenSlots(new Date(), 24);
  if (!slot) throw new Error("needs at least one open slot in the database");
  const token = await insertBooking({
    slot_id: slot.id,
    service_id: null,
    service_name: "Test booking",
    price_pounds: 25,
    deposit_pounds: 5,
    duration_min: 45,
    starts_at: slot.starts_at,
    client_name: "Test",
    client_email: TEST_EMAIL,
    client_phone: "07700900000",
    notes: null,
    status: "pending_deposit",
    expires_at: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
  });
  const { data } = await db.from("bookings").select("id, slot_id").eq("token", token!).single();
  return data!;
}

async function row(id: string) {
  const { data } = await db.from("bookings").select("status, paid_at, cancelled_at").eq("id", id).single();
  return data!;
}

describe("changing a booking's status (real database)", () => {
  it("marks paid once, refuses a repeat, then cancels and frees the slot", async () => {
    const booking = await newBooking();
    const now = new Date();

    expect(await changeBookingStatus(booking.id, "mark-paid", now)).toBe(true);
    expect(await row(booking.id)).toMatchObject({ status: "confirmed", paid_at: expect.any(String) });
    expect(await changeBookingStatus(booking.id, "mark-paid", now)).toBe(false);

    // The appointment is days away, so it can't be marked completed yet.
    expect(await changeBookingStatus(booking.id, "completed", now)).toBe(false);

    expect(await changeBookingStatus(booking.id, "cancel", now)).toBe(true);
    expect(await row(booking.id)).toMatchObject({ status: "cancelled", cancelled_at: expect.any(String) });
    expect((await getOpenSlots(new Date(), 24)).map((s) => s.id)).toContain(booking.slot_id);
  });

  it("ignores unknown ids", async () => {
    expect(await changeBookingStatus("00000000-0000-4000-8000-000000000000", "cancel", new Date())).toBe(false);
    expect(await changeBookingStatus("not-an-id", "cancel", new Date())).toBe(false);
  });
});

describe("the sweep (real database)", () => {
  const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000);
  const references = async (now: Date) => (await expireOverdueBookings(now)).map((b) => b.reference);

  it("expires an unpaid booking after its two-hour hold and frees the slot", async () => {
    const booking = await newBooking();
    const { data } = await db.from("bookings").select("reference").eq("id", booking.id).single();

    expect(await references(minutesFromNow(119))).not.toContain(data!.reference);
    expect((await row(booking.id)).status).toBe("pending_deposit");

    expect(await references(minutesFromNow(121))).toContain(data!.reference);
    expect((await row(booking.id)).status).toBe("expired");
    expect((await getOpenSlots(new Date(), 24)).map((s) => s.id)).toContain(booking.slot_id);

    // Already expired, so a second sweep leaves it alone (and sends no second email).
    expect(await references(minutesFromNow(121))).not.toContain(data!.reference);
  });

  it("doesn't expire a booking where the client says they've paid", async () => {
    const booking = await newBooking();
    await db.from("bookings").update({ client_says_paid_at: new Date().toISOString() }).eq("id", booking.id);

    await expireOverdueBookings(minutesFromNow(121));
    expect((await row(booking.id)).status).toBe("pending_deposit");
  });
});
