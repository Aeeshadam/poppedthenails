import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "New password · poppedthenail", robots: { index: false } };

export default async function ResetPasswordPage() {
  await requireAdmin();

  return (
    <main className="mx-auto flex w-full max-w-column flex-1 flex-col px-6 pt-20 pb-10">
      <Logo />
      <h1 className="mt-12 font-serif text-title">Set a new password</h1>
      <p className="mt-3 leading-relaxed text-muted">At least 12 characters. Let your phone suggest one and save it.</p>
      <ResetPasswordForm />
    </main>
  );
}
