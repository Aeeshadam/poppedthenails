import type { Metadata } from "next";
import { AccountLinks } from "@/components/admin/AccountLinks";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin · poppedthenail", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <main className="mx-auto w-full max-w-column flex-1 px-6 pt-4 pb-12">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="rounded-full bg-lilac px-3 py-1 text-[13px] font-semibold tracking-[0.12em] text-accent-hover">
            ADMIN
          </span>
        </div>
        <AccountLinks />
      </header>
      <AdminTabs />
      {children}
    </main>
  );
}
