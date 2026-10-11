import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/auth";

/** Where the password-reset email link lands: swaps its one-time code for a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  // Only ever send her on to an admin page.
  const destination = next?.startsWith("/admin/") ? next : "/admin";

  if (code) {
    const { error } = await (await createAuthClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destination, origin));
  }
  return NextResponse.redirect(new URL("/admin/login?error=link", origin));
}
