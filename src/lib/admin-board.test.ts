import { describe, expect, it } from "vitest";
import { boardSections, greeting, hasFinished, type BoardBooking } from "./admin-board";

function booking(id: string, status: BoardBooking["status"], starts_at: string, expires_at = starts_at): BoardBooking {
  return {
    id,
    reference: `POP-${id}`,
    service_name: "Gel manicure",
    deposit_pounds: 5,
    duration_min: 45,
    starts_at,
    client_name: id,
    notes: null,
    status,
    expires_at,
    client_says_paid_at: null,
  };
}

describe("boardSections", () => {
  // 10:00 UK time on Friday 9 October 2026.
  const now = new Date("2026-10-09T09:00:00Z");

  it("puts each booking in the right section", () => {
    const sections = boardSections(
      [
        booking("later-unpaid", "pending_deposit", "2026-10-12T16:00:00Z", "2026-10-09T10:30:00Z"),
        booking("sooner-unpaid", "pending_deposit", "2026-10-13T16:00:00Z", "2026-10-09T09:20:00Z"),
        booking("today-pm", "confirmed", "2026-10-09T15:00:00Z"),
        booking("today-am", "completed", "2026-10-09T08:00:00Z"),
        booking("tomorrow", "confirmed", "2026-10-10T09:00:00Z"),
        booking("gone", "expired", "2026-10-11T09:00:00Z"),
        booking("off", "cancelled", "2026-10-09T12:00:00Z"),
      ],
      now,
    );
    expect(sections.waiting.map((b) => b.id)).toEqual(["sooner-unpaid", "later-unpaid"]);
    expect(sections.today.map((b) => b.id)).toEqual(["today-am", "today-pm"]);
    expect(sections.upcoming.map((b) => b.id)).toEqual(["tomorrow"]);
  });

  it("uses the UK day: 23:30 UTC in summer is tomorrow", () => {
    const late = booking("late", "confirmed", "2026-10-09T23:30:00Z"); // 00:30 on the 10th in the UK
    expect(boardSections([late], now).upcoming.map((b) => b.id)).toEqual(["late"]);
  });
});

describe("greeting", () => {
  it("follows UK time of day", () => {
    expect(greeting(new Date("2026-10-09T10:59:00Z"))).toBe("Morning"); // 11:59 BST
    expect(greeting(new Date("2026-10-09T11:00:00Z"))).toBe("Afternoon"); // 12:00 BST
    expect(greeting(new Date("2026-10-09T16:00:00Z"))).toBe("Evening"); // 17:00 BST
  });
});

describe("hasFinished", () => {
  const appointment = { starts_at: "2026-10-09T09:00:00Z", duration_min: 45 };

  it("is false until the end time", () => {
    expect(hasFinished(appointment, new Date("2026-10-09T09:44:00Z"))).toBe(false);
  });

  it("is true from the end time", () => {
    expect(hasFinished(appointment, new Date("2026-10-09T09:45:00Z"))).toBe(true);
  });
});
