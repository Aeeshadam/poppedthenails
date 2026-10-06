"use client";

import { usePathname } from "next/navigation";
import { IconLink } from "@/components/IconButton";
import { Gear, SignOut } from "@/components/icons";

export function AccountLinks() {
  const onSettings = usePathname() === "/admin/settings";

  return (
    <nav aria-label="Account" className="flex items-center gap-1">
      <IconLink
        href="/admin/settings"
        label="Settings"
        variant={onSettings ? "current" : "ghost"}
        aria-current={onSettings ? "page" : undefined}
      >
        <Gear />
      </IconLink>
      {/* UI only: step 6 signs out with Supabase before going to the login page. */}
      <IconLink href="/admin/login" label="Sign out" variant="ghost">
        <SignOut />
      </IconLink>
    </nav>
  );
}
