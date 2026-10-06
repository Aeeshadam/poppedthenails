import { describe, expect, it } from "vitest";
import {
  addDays,
  addMinutes,
  calendarDate,
  calendarDayKey,
  formatDateKey,
  formatDayLong,
  formatDayShort,
  formatTime,
  formatTimeLeft,
  formatWeekRange,
  groupByLondonDay,
  londonDateKey,
  londonToUtc,
  msUntil,
  startOfWeek,
  weekdayIndex,
} from "./dates";

describe("display in UK time", () => {
  it("shows summer times an hour ahead of UTC", () => {
    expect(formatTime("2026-10-09T11:30:00Z")).toBe("12:30");
  });

  it("shows winter times the same as UTC", () => {
    expect(formatTime("2026-12-04T17:00:00Z")).toBe("17:00");
  });

  it("formats days like the designs", () => {
    expect(formatDayLong("2026-10-09T11:30:00Z")).toBe("Friday 9 October");
    expect(formatDayShort("2026-10-09T11:30:00Z")).toBe("Fri 9 Oct");
    expect(formatDateKey("2026-10-10", "long")).toBe("Saturday 10 October");
  });

  it("puts a late-evening summer UTC time on the next UK day", () => {
    expect(londonDateKey("2026-10-08T23:30:00Z")).toBe("2026-10-09");
  });
});

describe("clocks going forward (29 March 2026)", () => {
  it("shows times either side of the change correctly", () => {
    expect(formatTime("2026-03-29T00:30:00Z")).toBe("00:30");
    expect(formatTime("2026-03-29T01:30:00Z")).toBe("02:30");
  });

  it("converts UK times to UTC either side of the change", () => {
    expect(londonToUtc("2026-03-28", "17:00").toISOString()).toBe("2026-03-28T17:00:00.000Z");
    expect(londonToUtc("2026-03-29", "10:00").toISOString()).toBe("2026-03-29T09:00:00.000Z");
  });
});

describe("clocks going back (25 October 2026)", () => {
  it("converts UK times to UTC either side of the change", () => {
    expect(londonToUtc("2026-10-24", "17:00").toISOString()).toBe("2026-10-24T16:00:00.000Z");
    expect(londonToUtc("2026-10-25", "17:00").toISOString()).toBe("2026-10-25T17:00:00.000Z");
  });

  it("round-trips a slot time through UTC", () => {
    for (const key of ["2026-10-24", "2026-10-25", "2026-10-26"]) {
      const utc = londonToUtc(key, "18:30");
      expect(londonDateKey(utc)).toBe(key);
      expect(formatTime(utc)).toBe("18:30");
    }
  });
});

describe("calendar helpers", () => {
  it("finds weekdays and week starts", () => {
    expect(weekdayIndex("2026-10-05")).toBe(0);
    expect(weekdayIndex("2026-10-11")).toBe(6);
    expect(startOfWeek("2026-10-10")).toBe("2026-10-05");
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
  });
});

describe("calendar widget days", () => {
  it("round-trips a date key through a local Date", () => {
    for (const key of ["2026-03-29", "2026-10-25", "2026-12-31"]) {
      expect(calendarDayKey(calendarDate(key))).toBe(key);
    }
  });
});

describe("formatWeekRange", () => {
  it("names the month once within a month", () => {
    expect(formatWeekRange("2026-10-05")).toBe("5 – 11 October");
  });

  it("names both months across a month end", () => {
    expect(formatWeekRange("2026-09-28")).toBe("28 September – 4 October");
  });
});

describe("groupByLondonDay", () => {
  it("groups by UK day, keeping order", () => {
    const items = [
      { id: "a", starts_at: "2026-10-08T16:00:00Z" },
      { id: "b", starts_at: "2026-10-08T23:30:00Z" }, // 00:30 on the 9th in the UK
      { id: "c", starts_at: "2026-10-09T09:00:00Z" },
    ];
    const groups = groupByLondonDay(items);
    expect([...groups.keys()]).toEqual(["2026-10-08", "2026-10-09"]);
    expect(groups.get("2026-10-09")?.map((i) => i.id)).toEqual(["b", "c"]);
  });
});

describe("time arithmetic", () => {
  it("adds minutes to a date or an ISO string", () => {
    expect(addMinutes("2026-10-09T11:30:00Z", 45).toISOString()).toBe("2026-10-09T12:15:00.000Z");
    expect(addMinutes(new Date("2026-10-09T11:30:00Z"), -120).toISOString()).toBe("2026-10-09T09:30:00.000Z");
  });

  it("measures time until a moment, negative once passed", () => {
    const now = new Date("2026-10-09T10:00:00Z");
    expect(msUntil("2026-10-09T10:25:00Z", now)).toBe(25 * 60_000);
    expect(msUntil("2026-10-09T09:59:00Z", now)).toBe(-60_000);
  });
});

describe("formatTimeLeft", () => {
  it("shows hours and minutes", () => {
    expect(formatTimeLeft(100 * 60_000)).toBe("1 h 40 min left");
    expect(formatTimeLeft(120 * 60_000)).toBe("2 h left");
  });

  it("shows minutes only under an hour, rounding up", () => {
    expect(formatTimeLeft(24.5 * 60_000)).toBe("25 min left");
  });

  it("says when time is up", () => {
    expect(formatTimeLeft(0)).toBe("Time's up");
  });
});
