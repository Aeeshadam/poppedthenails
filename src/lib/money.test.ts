import { describe, expect, it } from "vitest";
import { formatPence } from "./money";

describe("formatPence", () => {
  it("shows whole pounds without pence", () => {
    expect(formatPence(2500)).toBe("£25");
    expect(formatPence(500)).toBe("£5");
  });

  it("shows pence to two places", () => {
    expect(formatPence(2550)).toBe("£25.50");
    expect(formatPence(1205)).toBe("£12.05");
  });

  it("handles zero", () => {
    expect(formatPence(0)).toBe("£0");
  });
});
