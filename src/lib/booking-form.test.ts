import { describe, expect, it } from "vitest";
import { parseBookingForm } from "./booking-form";

const valid = {
  service: "11111111-1111-4111-8111-111111111111",
  slot: "22222222-2222-4222-8222-222222222222",
  name: "  Maya Smith ",
  email: " Maya@Example.com ",
  phone: "07700 900 000",
  notes: "",
  policy: "on",
};

describe("parseBookingForm", () => {
  it("accepts a valid form and tidies it", () => {
    const result = parseBookingForm(valid);
    expect(result).toEqual({
      ok: true,
      data: { ...valid, name: "Maya Smith", email: "maya@example.com", phone: "07700900000", notes: null },
    });
  });

  it("accepts +44 numbers and keeps notes", () => {
    const result = parseBookingForm({ ...valid, phone: "+44 7700 900000", notes: " Milky pink " });
    expect(result.ok && result.data.phone).toBe("+447700900000");
    expect(result.ok && result.data.notes).toBe("Milky pink");
  });

  it("gives a message for each bad field", () => {
    const result = parseBookingForm({ ...valid, name: " ", email: "nope", phone: "0161 496 0000", policy: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["email", "name", "phone", "policy"]);
    expect(result.errors.phone).toMatch(/UK mobile/);
    expect(result.badIds).toBe(false);
  });

  it("asks for the policy box when it isn't ticked", () => {
    const unticked = Object.fromEntries(Object.entries(valid).filter(([key]) => key !== "policy"));
    const result = parseBookingForm(unticked);
    expect(!result.ok && result.errors.policy).toMatch(/tick/);
  });

  it("flags tampered service or slot ids separately", () => {
    const result = parseBookingForm({ ...valid, slot: "not-a-uuid" });
    expect(!result.ok && result.badIds).toBe(true);
  });

  it("limits notes to 500 characters", () => {
    const result = parseBookingForm({ ...valid, notes: "x".repeat(501) });
    expect(!result.ok && result.errors.notes).toMatch(/500/);
  });
});
