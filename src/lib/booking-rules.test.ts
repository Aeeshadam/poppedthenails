import { describe, expect, it } from "vitest";
import { holdExpiresAt, holdsSlot, isPastNoticeCutoff, openSlots, quotedDeposit } from "./booking-rules";

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

describe("openSlots", () => {
  const now = new Date("2026-10-09T12:00:00Z");
  const slot = (id: string, starts_at: string) => ({ id, starts_at });

  it("leaves out slots a live booking holds", () => {
    const slots = [slot("free", "2026-10-12T16:00:00Z"), slot("held", "2026-10-12T17:30:00Z")];
    expect(openSlots(slots, new Set(["held"]), now, 24).map((s) => s.id)).toEqual(["free"]);
  });

  it("applies the 24-hour cut-off", () => {
    const slots = [
      slot("23h59", "2026-10-10T11:59:00Z"),
      slot("exactly-24h", "2026-10-10T12:00:00Z"),
      slot("24h01", "2026-10-10T12:01:00Z"),
    ];
    expect(openSlots(slots, new Set(), now, 24).map((s) => s.id)).toEqual(["24h01"]);
  });

  it("measures the cut-off in real hours across the October clock change", () => {
    // 01:00 UTC on Sat 24 Oct is 02:00 BST. 24 real hours later is 01:00 UTC on Sun 25,
    // which is 01:00 GMT after the clocks go back.
    const before = new Date("2026-10-24T01:00:00Z");
    const slots = [slot("too-soon", "2026-10-25T00:59:00Z"), slot("ok", "2026-10-25T01:01:00Z")];
    expect(openSlots(slots, new Set(), before, 24).map((s) => s.id)).toEqual(["ok"]);
  });

  it("uses the configured notice", () => {
    expect(openSlots([slot("in-3h", "2026-10-09T15:00:00Z")], new Set(), now, 2)).toHaveLength(1);
  });
});

describe("isPastNoticeCutoff", () => {
  it("is true only more than the notice before the slot", () => {
    const now = new Date("2026-10-09T12:00:00Z");
    expect(isPastNoticeCutoff("2026-10-10T12:00:00Z", now, 24)).toBe(false);
    expect(isPastNoticeCutoff("2026-10-10T12:01:00Z", now, 24)).toBe(true);
  });
});

describe("holdExpiresAt", () => {
  it("is the hold length after now", () => {
    expect(holdExpiresAt(new Date("2026-10-09T12:00:00Z"), 2).toISOString()).toBe("2026-10-09T14:00:00.000Z");
  });
});

describe("quotedDeposit", () => {
  it("is the lowest deposit in use, or £5 with no services", () => {
    expect(quotedDeposit([{ deposit_pounds: 5 }, { deposit_pounds: 10 }])).toBe(5);
    expect(quotedDeposit([])).toBe(5);
  });
});
