import type { ReactNode } from "react";

export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-column items-center justify-between gap-4 px-6 py-4">
        {children}
      </div>
    </div>
  );
}
