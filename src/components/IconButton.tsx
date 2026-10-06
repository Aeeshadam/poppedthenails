import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "outline" | "ghost" | "current";

type IconStyle = {
  /** Accessible name; the icon itself is hidden from screen readers. Also shown as a tooltip. */
  label: string;
  /** "outline": round with a border. "ghost": no border until hovered. "current": the page you're on. */
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  outline: "border border-line bg-surface hover:border-accent disabled:opacity-30 disabled:hover:border-line",
  ghost: "text-muted hover:bg-soft hover:text-ink",
  current: "bg-soft text-accent",
};

function iconClasses(variant: Variant, extra: string) {
  return `inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent ${variants[variant]} ${extra}`;
}

export function IconButton({
  label,
  variant = "outline",
  className = "",
  type = "button",
  ...rest
}: Omit<ComponentProps<"button">, "aria-label"> & IconStyle) {
  return <button type={type} aria-label={label} title={label} {...rest} className={iconClasses(variant, className)} />;
}

export function IconLink({
  label,
  variant = "outline",
  className = "",
  ...rest
}: Omit<ComponentProps<typeof Link>, "aria-label"> & IconStyle) {
  return <Link aria-label={label} title={label} {...rest} className={iconClasses(variant, className)} />;
}
