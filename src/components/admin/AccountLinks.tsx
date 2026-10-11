"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { IconButton, IconLink } from "@/components/IconButton";
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
      <form action={signOut}>
        <IconButton type="submit" label="Sign out" variant="ghost">
          <SignOut />
        </IconButton>
      </form>
    </nav>
  );
}
