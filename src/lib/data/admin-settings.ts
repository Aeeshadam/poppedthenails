import "server-only";
import type { SettingsForm } from "@/lib/admin-forms";
import { createServerClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";

export async function getSettings(): Promise<Settings> {
  const { data, error } = await createServerClient()
    .from("settings")
    .select(
      "bank_account_name, bank_sort_code, bank_account_number, hold_hours, min_notice_hours, deposit_policy, address, hours_note, about_text",
    )
    .single();
  if (error) throw error;
  return data;
}

export async function saveSettings(settings: SettingsForm): Promise<void> {
  // The table holds a single row, keyed by id = true.
  const { error } = await createServerClient().from("settings").update(settings).eq("id", true);
  if (error) throw error;
}
