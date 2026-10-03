import type { ReactNode } from "react";

type CardProps = {
  /** "raised": white card. "outline": page background with a border. */
  variant?: "raised" | "outline";
  className?: string;
  children: ReactNode;
};

export function Card({ variant = "raised", className = "", children }: CardProps) {
  const look =
    variant === "raised"
      ? "bg-surface"
      : "border border-line bg-background";
  return <div className={`rounded-card p-6 ${look} ${className}`}>{children}</div>;
}
