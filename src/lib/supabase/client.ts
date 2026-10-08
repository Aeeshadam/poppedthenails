import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// The public key: Row Level Security limits it to reading active services.
// NEXT_PUBLIC_ variables must be read by their full name so Next can inline them.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local.");
}

export const supabase = createClient<Database>(url, anonKey);
