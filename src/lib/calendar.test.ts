import { describe, expect, it } from "vitest";
import { buildIcs } from "./calendar";

describe("buildIcs", () => {
  const ics = buildIcs(
    {
      uid: "booking-1",
      start: new Date("2026-10-09T11:30:00Z"),
      durationMin: 60,
      title: "BIAB overlay, poppedthenail",
      location: "1 High St, Manchester; M1 1AA",
    },
    new Date("2026-10-01T09:00:00Z"),
  );

  it("uses UTC start and end times", () => {
    expect(ics).toContain("DTSTART:20261009T113000Z");
    expect(ics).toContain("DTEND:20261009T123000Z");
  });

  it("escapes commas and semicolons", () => {
    expect(ics).toContain("SUMMARY:BIAB overlay\\, poppedthenail");
    expect(ics).toContain("LOCATION:1 High St\\, Manchester\\; M1 1AA");
  });

  it("uses CRLF line endings", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});
