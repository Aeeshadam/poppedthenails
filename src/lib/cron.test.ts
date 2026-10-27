import { describe, expect, it } from "vitest";
import { hasCronSecret } from "./cron";

describe("hasCronSecret", () => {
  it("accepts the right secret", () => {
    expect(hasCronSecret("Bearer s3cret", "s3cret")).toBe(true);
  });

  it("rejects a missing or wrong secret", () => {
    expect(hasCronSecret(null, "s3cret")).toBe(false);
    expect(hasCronSecret("Bearer wrong", "s3cret")).toBe(false);
    expect(hasCronSecret("s3cret", "s3cret")).toBe(false);
  });

  it("rejects everything when no secret is set", () => {
    expect(hasCronSecret("Bearer ", "")).toBe(false);
    expect(hasCronSecret("Bearer undefined", undefined)).toBe(false);
  });
});
