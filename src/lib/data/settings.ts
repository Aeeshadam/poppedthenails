import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";

type BankFields = "bank_account_name" | "bank_sort_code" | "bank_account_number";

/** Everything except the bank details, which only the deposit page may show. */
export type PublicSettings = Omit<Settings, BankFields>;
export type BankDetails = Pick<Settings, BankFields | "hold_hours">;

export async function getPublicSettings(): Promise<PublicSettings> {
  const { data, error } = await createServerClient()
    .from("settings")
    .select("hold_hours, min_notice_hours, deposit_policy, address, hours_note, about_text")
    .single();
  if (error) throw error;
  return data;
}

export async function getBankDetails(): Promise<BankDetails> {
  const { data, error } = await createServerClient()
    .from("settings")
    .select("bank_account_name, bank_sort_code, bank_account_number, hold_hours")
    .single();
  if (error) throw error;
  return data;
}
