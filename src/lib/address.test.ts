import { describe, expect, it } from "vitest";
import { addressLines, addressOneLine, directionsUrl } from "./address";

describe("address helpers", () => {
  const address = "12 Oak Street\n  Manchester, M1 1AA \n";

  it("splits into trimmed, non-empty lines", () => {
    expect(addressLines(address)).toEqual(["12 Oak Street", "Manchester, M1 1AA"]);
  });

  it("joins onto one line", () => {
    expect(addressOneLine(address)).toBe("12 Oak Street, Manchester, M1 1AA");
  });

  it("builds an encoded Google Maps link", () => {
    expect(directionsUrl(address)).toBe(
      "https://www.google.com/maps/search/?api=1&query=12%20Oak%20Street%2C%20Manchester%2C%20M1%201AA",
    );
  });
});
