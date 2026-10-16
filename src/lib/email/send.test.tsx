import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("server-only", () => ({}));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));

const { sendEmail } = await import("./send");
const email = { to: "client@example.test", subject: "Hi", react: <p>Hi</p> };

describe("sendEmail", () => {
  beforeEach(() => {
    send.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("EMAIL_FROM", "from@example.test");
    vi.stubEnv("ADMIN_EMAIL", "her@example.test");
  });

  it("sends from EMAIL_FROM with replies to her", async () => {
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    expect(await sendEmail(email)).toBe(true);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ from: "from@example.test", replyTo: "her@example.test", to: "client@example.test", html: expect.stringContaining("<p>Hi</p>") }),
    );
  });

  it("returns false instead of throwing when Resend reports an error", async () => {
    send.mockResolvedValue({ data: null, error: { message: "bad key" } });
    expect(await sendEmail(email)).toBe(false);
  });

  it("returns false instead of throwing when the request fails", async () => {
    send.mockRejectedValue(new Error("offline"));
    expect(await sendEmail(email)).toBe(false);
  });
});
