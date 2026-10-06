import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div"> & {
  /** "raised": white card. "outline": page background with a border. */
  variant?: "raised" | "outline";
};

/** Rounded card surface. Callers set the padding, since it varies by design. */
export function Card({ variant = "raised", className = "", ...rest }: CardProps) {
  const look = variant === "raised" ? "bg-surface" : "border border-line bg-background";
  return <div {...rest} className={`rounded-card ${look} ${className}`} />;
}
