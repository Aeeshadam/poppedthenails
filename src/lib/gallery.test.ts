import { describe, expect, it } from "vitest";
import { fitSize, photoUploadSchema } from "./gallery";

const file = (bytes: number, type = "image/jpeg") => new File([new Uint8Array(bytes)], "p.jpg", { type });

describe("fitSize", () => {
  it("shrinks a portrait phone photo so its short side is 600", () => {
    expect(fitSize(3024, 4032, 600, "short")).toEqual({ width: 600, height: 800 });
  });

  it("shrinks so the long side is 1600", () => {
    expect(fitSize(3024, 4032, 1600, "long")).toEqual({ width: 1200, height: 1600 });
  });

  it("never enlarges a small photo", () => {
    expect(fitSize(400, 300, 1600, "long")).toEqual({ width: 400, height: 300 });
  });
});

describe("photoUploadSchema", () => {
  it("accepts resized JPEGs", () => {
    expect(photoUploadSchema.safeParse({ thumb: file(60_000), full: file(400_000), alt: "" }).success).toBe(true);
  });

  it("rejects other file types, empty files and oversized files", () => {
    expect(photoUploadSchema.safeParse({ thumb: file(60_000, "image/png"), full: file(400_000), alt: "" }).success).toBe(false);
    expect(photoUploadSchema.safeParse({ thumb: file(0), full: file(400_000), alt: "" }).success).toBe(false);
    expect(photoUploadSchema.safeParse({ thumb: file(60_000), full: file(4 * 1024 * 1024), alt: "" }).success).toBe(false);
  });

  it("rejects a long description", () => {
    expect(photoUploadSchema.safeParse({ thumb: file(1), full: file(1), alt: "x".repeat(201) }).success).toBe(false);
  });
});
