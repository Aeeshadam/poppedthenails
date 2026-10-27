"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Bookings" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
] as const;

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="mt-5 grid grid-cols-4 gap-1 rounded-full bg-soft p-1.5">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center justify-center rounded-full text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
              active ? "bg-surface font-semibold shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
