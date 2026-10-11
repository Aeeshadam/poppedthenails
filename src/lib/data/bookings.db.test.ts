// Runs against the real database (npm run test:db) and removes what it adds.
import { afterAll, describe, expect, it } from "vitest";
import { createServerClient } from "@/lib/supabase/server";
import { insertBooking, type NewBooking } from "./bookings";
import { getOpenSlots } from "./slots";

const db = createServerClient();
const TEST_EMAIL = "db-test@example.com";

function booking(slot: { id: string; starts_at: string }): NewBooking {
  return {
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
  };
}

afterAll(async () => {
  await db.from("bookings").delete().eq("client_email", TEST_EMAIL);
});

describe("bookings in the real database", () => {
  it("lets only one live booking hold a slot, and frees it once that one expires", async () => {
    const [slot] = await getOpenSlots(new Date(), 24);
    expect(slot, "needs at least one open slot in the database").toBeDefined();
    if (!slot) return;

    const first = await insertBooking(booking(slot));
    expect(first).toBeTruthy();
    expect(await insertBooking(booking(slot))).toBeNull();
    expect((await getOpenSlots(new Date(), 24)).map((s) => s.id)).not.toContain(slot.id);

    await db.from("bookings").update({ status: "expired" }).eq("token", first!);
    expect(await insertBooking(booking(slot))).toBeTruthy();
  });

  it("numbers references POP-1001, POP-1002…", async () => {
    const [, a, b] = await getOpenSlots(new Date(), 24);
    if (!a || !b) return;
    const tokens = [await insertBooking(booking(a)), await insertBooking(booking(b))];
    const { data } = await db.from("bookings").select("reference").in("token", tokens as string[]).order("reference");
    const refs = data?.map((r) => r.reference) ?? [];
    expect(refs).toHaveLength(2);
    for (const ref of refs) expect(ref).toMatch(/^POP-\d{4,}$/);
    expect(new Set(refs).size).toBe(2);
  });
});
