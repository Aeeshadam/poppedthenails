import { describe, expect, it } from "vitest";
import { firstErrors, serviceFormSchema, settingsFormSchema } from "./admin-forms";

describe("serviceFormSchema", () => {
  const valid = { name: " Gel manicure ", duration_min: "45", price_pounds: "25", deposit_pounds: "5", description: " " };

  it("accepts and tidies a valid service", () => {
    expect(serviceFormSchema.parse(valid)).toEqual({
      name: "Gel manicure",
      duration_min: 45,
      price_pounds: 25,
      deposit_pounds: 5,
      description: null,
    });
  });

  it("keeps length within 15 to 240 minutes", () => {
    expect(serviceFormSchema.safeParse({ ...valid, duration_min: "10" }).success).toBe(false);
    expect(serviceFormSchema.safeParse({ ...valid, duration_min: "300" }).success).toBe(false);
  });

  it("wants whole pounds and a deposit no more than the price", () => {
    const pence = serviceFormSchema.safeParse({ ...valid, price_pounds: "25.50" });
    expect(!pence.success && firstErrors(pence.error).price_pounds).toMatch(/whole pounds/);
    const big = serviceFormSchema.safeParse({ ...valid, deposit_pounds: "30" });
    expect(!big.success && firstErrors(big.error).deposit_pounds).toMatch(/more than the price/);
  });
});

describe("settingsFormSchema", () => {
  const valid = {
    bank_account_name: "M Smith",
    bank_sort_code: "12 34 56",
    bank_account_number: "1234 5678",
    address: "  12 Oak Street \n\n Manchester, M1 1AA ",
    hours_note: "Weekday evenings",
    about_text: "Hi",
    deposit_policy: "Non-refundable.",
    hold_hours: "2",
    min_notice_hours: "24",
  };

  it("tidies the sort code, account number and address", () => {
    expect(settingsFormSchema.parse(valid)).toMatchObject({
      bank_sort_code: "12-34-56",
      bank_account_number: "12345678",
      address: "12 Oak Street\nManchester, M1 1AA",
      hold_hours: 2,
      min_notice_hours: 24,
    });
  });

  it("rejects short bank numbers and out-of-range hours", () => {
    const result = settingsFormSchema.safeParse({ ...valid, bank_sort_code: "1234", bank_account_number: "123", hold_hours: "0" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(firstErrors(result.error)).sort()).toEqual(["bank_account_number", "bank_sort_code", "hold_hours"]);
  });
});
