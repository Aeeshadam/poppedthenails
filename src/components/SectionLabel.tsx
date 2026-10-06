import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-8 mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-muted">{children}</h2>
  );
}
