// Runs against the real database (npm run test:db) and puts the settings back afterwards.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Settings } from "@/lib/types";
import { getSettings, saveSettings } from "./admin-settings";

let original: Settings;

beforeAll(async () => {
  original = await getSettings();
});

afterAll(async () => {
  await saveSettings(original);
});

describe("admin settings (real database)", () => {
  it("saves and reads back the settings row", async () => {
    await saveSettings({ ...original, hours_note: "Test hours", hold_hours: 3 });
    expect(await getSettings()).toMatchObject({ hours_note: "Test hours", hold_hours: 3 });
  });
});
