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
});
