import { describe, expect, it } from "vitest";
import { GRID_TIMES, slotStart, weekDays } from "./availability";

describe("GRID_TIMES", () => {
  it("runs every half hour from 08:00 to 21:00", () => {
    expect(GRID_TIMES[0]).toBe("08:00");
    expect(GRID_TIMES[1]).toBe("08:30");
    expect(GRID_TIMES.at(-1)).toBe("21:00");
    expect(GRID_TIMES).toHaveLength(27);
  });
});

describe("weekDays", () => {
  it("lists seven days in a row from the start date", () => {
    expect(weekDays("2026-10-26")).toEqual([
      "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01",
    ]);
  });
});

describe("slotStart", () => {
  it("stores a UK time as UTC either side of the October clock change", () => {
    expect(slotStart("2026-10-24", "17:00")).toBe("2026-10-24T16:00:00.000Z");
    expect(slotStart("2026-10-26", "17:00")).toBe("2026-10-26T17:00:00.000Z");
  });

  it("stores a UK time as UTC either side of the March clock change", () => {
    expect(slotStart("2026-03-28", "10:00")).toBe("2026-03-28T10:00:00.000Z");
    expect(slotStart("2026-03-30", "10:00")).toBe("2026-03-30T09:00:00.000Z");
  });
});
