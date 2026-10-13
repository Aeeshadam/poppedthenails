import "server-only";
import { isUuid } from "@/lib/params";
import { supabase } from "@/lib/supabase/client";
import type { Service } from "@/lib/types";

// Services only need the public key: Row Level Security returns active ones only.
const COLUMNS = "id, name, description, duration_min, price_pounds, deposit_pounds, is_active";

export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase.from("services").select(COLUMNS).eq("is_active", true).order("created_at");
  if (error) throw error;
  return data;
}

export async function getActiveService(id: string | undefined): Promise<Service | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await supabase.from("services").select(COLUMNS).eq("id", id).eq("is_active", true).maybeSingle();
  if (error) throw error;
  return data;
}
