import "server-only";
import type { ServiceForm } from "@/lib/admin-forms";
import { isUuid } from "@/lib/params";
import { createServerClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";

const COLUMNS = "id, name, description, duration_min, price_pounds, deposit_pounds, is_active";

/** Every service, hidden ones included, in the order they were added. */
export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await createServerClient().from("services").select(COLUMNS).order("created_at");
  if (error) throw error;
  return data;
}

export async function createService(service: ServiceForm): Promise<void> {
  const { error } = await createServerClient().from("services").insert(service);
  if (error) throw error;
}

export async function updateService(id: string, service: ServiceForm): Promise<void> {
  if (!isUuid(id)) return;
  const { error } = await createServerClient().from("services").update(service).eq("id", id);
  if (error) throw error;
}

export async function setServiceActive(id: string, isActive: boolean): Promise<void> {
  if (!isUuid(id)) return;
  const { error } = await createServerClient().from("services").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}
