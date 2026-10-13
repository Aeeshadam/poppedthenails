// Runs against the real database (npm run test:db) and removes what it adds.
import { afterAll, describe, expect, it } from "vitest";
import { slotStart } from "@/lib/availability";
import { addDays, londonDateKey } from "@/lib/dates";
import { createServerClient } from "@/lib/supabase/server";
import { addSlots, getSlotsBetween, removeOpenSlot } from "./admin-slots";
import { insertBooking } from "./bookings";

const db = createServerClient();
const TEST_EMAIL = "slots-db-test@example.com";
// A day far enough ahead that it holds no real slots, at an odd time.
const day = addDays(londonDateKey(new Date()), 200);
const start = slotStart(day, "06:15");

afterAll(async () => {
  await db.from("bookings").delete().eq("client_email", TEST_EMAIL);
  await db.from("slots").delete().eq("starts_at", start);
});

describe("admin slots (real database)", () => {
  it("adds a slot once, removes an open one, and won't remove a booked one", async () => {
    await addSlots([start]);
    await addSlots([start]); // a duplicate is skipped, not an error
    const window = [new Date(`${day}T00:00:00Z`), new Date(`${addDays(day, 1)}T12:00:00Z`)] as const;
    expect((await getSlotsBetween(...window)).filter((s) => s.starts_at === start)).toEqual([{ starts_at: start, bookedBy: null }]);

    expect(await removeOpenSlot(start)).toBe(true);
    expect(await getSlotsBetween(...window)).not.toContainEqual(expect.objectContaining({ starts_at: start }));

    await addSlots([start]);
    const { data: slot } = await db.from("slots").select("id").eq("starts_at", start).single();
    await insertBooking({
      slot_id: slot!.id,
      service_id: null,
      service_name: "Test booking",
      price_pounds: 25,
      deposit_pounds: 5,
      duration_min: 45,
      starts_at: start,
      client_name: "Booked Client",
      client_email: TEST_EMAIL,
      client_phone: "07700900000",
      notes: null,
      status: "pending_deposit",
      expires_at: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
    });

    expect(await removeOpenSlot(start)).toBe(false);
    expect((await getSlotsBetween(...window)).find((s) => s.starts_at === start)?.bookedBy).toBe("Booked Client");
  });
});
