import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmail = vi.fn();
const getBookingById = vi.fn();
vi.mock("server-only", () => ({}));
vi.mock("./send", () => ({ sendEmail }));
vi.mock("@/lib/data/bookings", () => ({ getBookingById, getBookingByToken: vi.fn() }));
vi.mock("@/lib/data/settings", () => ({
  getBankDetails: vi.fn(),
  getPublicSettings: async () => ({ address: "12 Sample Street\nManchester M1 1AA", deposit_policy: "Non-refundable." }),
}));

const { sendBookedEmail, sendCancelledEmail } = await import("./booking-emails");

const booking = {
  id: "b1",
  token: "t1",
  reference: "POP-1001",
  client_name: "Amara",
  client_email: "amara@example.test",
  service_name: "BIAB overlay",
  starts_at: "2026-10-23T16:30:00Z",
  duration_min: 60,
  price_pounds: 35,
  deposit_pounds: 5,
};

describe("booking emails", () => {
  beforeEach(() => {
    sendEmail.mockReset();
    getBookingById.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("email 4 goes to the client with a calendar file at the right times", async () => {
    getBookingById.mockResolvedValue(booking);
    await sendBookedEmail("b1");
    const email = sendEmail.mock.calls[0]?.[0];
    expect(email.to).toBe("amara@example.test");
    const ics = email.attachments[0].content as string;
    expect(ics).toContain("DTSTART:20261023T163000Z");
    expect(ics).toContain("DTEND:20261023T173000Z");
    expect(ics).toContain("LOCATION:12 Sample Street\\, Manchester M1 1AA");
  });

  it("sends nothing for an unknown booking", async () => {
    getBookingById.mockResolvedValue(null);
    await sendCancelledEmail("missing");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("never throws, even if loading the booking fails", async () => {
    getBookingById.mockRejectedValue(new Error("database down"));
    await expect(sendCancelledEmail("b1")).resolves.toBeUndefined();
  });
});
