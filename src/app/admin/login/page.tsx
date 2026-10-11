import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Studio admin · poppedthenail", robots: { index: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-column flex-1 flex-col px-6 pt-20 pb-10">
      <Logo />
      <h1 className="mt-12 font-serif text-title">Studio admin</h1>
      <p className="mt-3 leading-relaxed text-muted">Sign in with your email and password.</p>
      <LoginForm notice={error === "link" ? "That link has expired or was opened on another device. Please try again." : undefined} />
      <p className="mt-auto pt-16 text-center text-[15px] text-muted">Only her email can sign in here.</p>
    </main>
  );
}
