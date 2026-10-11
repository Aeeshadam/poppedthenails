import "server-only";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { isAdminEmail } from "./admin-email";
import { createAuthClient } from "./supabase/auth";

/** The signed-in admin, or null. getUser() checks the session with Supabase rather than trusting the cookie. */
export async function getAdmin(): Promise<User | null> {
  const { data } = await (await createAuthClient()).auth.getUser();
  return isAdminEmail(data.user?.email, process.env.ADMIN_EMAIL) ? data.user : null;
}

/** Every admin page and action starts with this. */
export async function requireAdmin(): Promise<User> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
