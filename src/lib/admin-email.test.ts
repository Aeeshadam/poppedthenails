import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin-email";

describe("isAdminEmail", () => {
  it("matches the admin email, ignoring case and spaces", () => {
    expect(isAdminEmail(" Her@Example.com ", "her@example.com")).toBe(true);
  });

  it("refuses any other address", () => {
    expect(isAdminEmail("someone@example.com", "her@example.com")).toBe(false);
    expect(isAdminEmail("her@example.com.evil.com", "her@example.com")).toBe(false);
  });

  it("refuses everyone when either side is missing", () => {
    expect(isAdminEmail("her@example.com", undefined)).toBe(false);
    expect(isAdminEmail("her@example.com", "")).toBe(false);
    expect(isAdminEmail(null, "her@example.com")).toBe(false);
  });
});
