import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Studio admin · poppedthenail", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-column flex-1 flex-col px-6 pt-20 pb-10">
      <Logo />
      <h1 className="mt-12 font-serif text-title">Studio admin</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Enter your email and we&rsquo;ll send you a link to sign in. No password needed.
      </p>
      <LoginForm />
      <p className="mt-auto pt-16 text-center text-[15px] text-muted">Only her email can sign in here.</p>
    </main>
  );
}
