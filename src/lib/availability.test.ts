import { describe, expect, it } from "vitest";
import { copyWeekForward, GRID_TIMES, slotStart, weekDays } from "./availability";

describe("GRID_TIMES", () => {
  it("runs every half hour from 08:00 to 21:00", () => {
    expect(GRID_TIMES[0]).toBe("08:00");
    expect(GRID_TIMES[1]).toBe("08:30");
    expect(GRID_TIMES.at(-1)).toBe("21:00");
    expect(GRID_TIMES).toHaveLength(27);
  });
});

describe("weekDays", () => {
  it("lists Monday to Sunday", () => {
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

describe("copyWeekForward", () => {
  it("keeps the UK time when copying across the October clock change", () => {
    // Week of 19 October is in summer time; the clocks go back on Sunday 25 October.
    const thisWeek = [slotStart("2026-10-20", "17:00"), slotStart("2026-10-24", "11:00")];
    expect(copyWeekForward(thisWeek, "2026-10-19")).toEqual([
      "2026-10-27T17:00:00.000Z", // Tue 27 Oct, 17:00 GMT
      "2026-10-31T11:00:00.000Z", // Sat 31 Oct, 11:00 GMT
    ]);
  });

  it("keeps the UK time when copying across the March clock change", () => {
    // The clocks go forward on Sunday 29 March.
    expect(copyWeekForward([slotStart("2026-03-24", "18:30")], "2026-03-23")).toEqual([
      "2026-03-31T17:30:00.000Z", // Tue 31 Mar, 18:30 BST
    ]);
  });

  it("skips times next week already has and ignores other weeks", () => {
    const slots = [
      slotStart("2026-10-05", "17:00"),
      slotStart("2026-10-12", "17:00"), // next week already has this
      slotStart("2026-10-01", "17:00"), // last week: not copied
    ];
    expect(copyWeekForward(slots, "2026-10-05")).toEqual([]);
  });
});
