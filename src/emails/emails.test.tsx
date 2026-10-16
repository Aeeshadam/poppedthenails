// @vitest-environment node
import { render } from "@react-email/components";
import { describe, expect, it } from "vitest";
import { sampleEmails } from "./samples";

const html = async (index: number) => {
  const sample = sampleEmails("https://example.test")[index];
  if (!sample) throw new Error("No sample");
  return render(sample.email, { plainText: true });
};

describe("emails", () => {
  it("1: deposit email has the amount, bank details, reference and UK time", async () => {
    const text = await html(0);
    for (const detail of ["£5.00", "M Example", "00-00-00", "12345678", "POP-1001", "17:30", "Friday 23 October", "2 hours"]) {
      expect(text).toContain(detail);
    }
    expect(text).toContain("https://example.test/booking/sample");
  });

  it("only email 1 contains bank details", async () => {
    for (const index of [1, 2, 3, 4, 5]) expect(await html(index)).not.toContain("12345678");
  });

  it("2 and 3 link to the admin page", async () => {
    for (const index of [1, 2]) {
      const text = await html(index);
      expect(text).toContain("POP-1001");
      expect(text).toContain("https://example.test/admin");
    }
  });

  it("4: booked email has the address, amount left and policy", async () => {
    const text = await html(3);
    for (const detail of ["12 Sample Street, Manchester M1 1AA", "£30", "non-refundable", "17:30"]) {
      expect(text).toContain(detail);
    }
  });

  it("5 links to book again, 6 gives her Instagram", async () => {
    expect(await html(4)).toContain("https://example.test/book");
    expect(await html(5)).toContain("@poppedthenail");
  });
});
