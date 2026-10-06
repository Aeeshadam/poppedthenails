import type { ReactNode } from "react";

type Tone = "warning" | "success" | "lilac";

const tones: Record<Tone, string> = {
  warning: "bg-warning-bg text-warning",
  success: "bg-success-bg text-success",
  lilac: "bg-lilac text-accent-hover",
};

export function Badge({ tone, className = "", children }: { tone: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[13px] font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
