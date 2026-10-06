import { describe, expect, it } from "vitest";
import { formatPounds } from "./money";

describe("formatPounds", () => {
  it("adds the pound sign", () => {
    expect(formatPounds(25)).toBe("£25");
    expect(formatPounds(5)).toBe("£5");
  });

  it("handles three-figure prices", () => {
    expect(formatPounds(120)).toBe("£120");
  });

  it("handles zero", () => {
    expect(formatPounds(0)).toBe("£0");
  });

  it("can show pence for deposit amounts", () => {
    expect(formatPounds(5, { pence: true })).toBe("£5.00");
  });
});
