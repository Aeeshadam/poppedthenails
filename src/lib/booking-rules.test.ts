import { describe, expect, it } from "vitest";
import { holdsSlot } from "./booking-rules";

describe("holdsSlot", () => {
  it("is true for bookings that block the slot", () => {
    expect(holdsSlot("pending_deposit")).toBe(true);
    expect(holdsSlot("confirmed")).toBe(true);
  });

  it("is false for bookings that free the slot", () => {
    for (const status of ["expired", "cancelled", "completed", "no_show"] as const) {
      expect(holdsSlot(status)).toBe(false);
    }
  });
});
