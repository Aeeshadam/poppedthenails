import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "dark" | "light" | "secondary" | "outline" | "soft";
type Size = "md" | "field" | "lg";
type StyleProps = { variant?: Variant; size?: Size };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover",
  dark: "bg-ink text-white hover:bg-accent-hover active:bg-accent-hover",
  light: "bg-surface text-ink hover:bg-soft",
  secondary: "border border-line bg-surface text-ink hover:border-accent",
  outline: "border-[1.5px] border-ink text-ink hover:bg-soft",
  soft: "bg-soft text-accent-hover hover:bg-lilac",
};

// md is the 44px minimum touch target, field matches a 52px input, lg is the spec's 56px pill.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[15px]",
  field: "min-h-[52px] px-5 text-[15px]",
  lg: "min-h-14 px-8 text-[15px]",
};

export function buttonClasses({ variant = "primary", size = "lg" }: StyleProps = {}, extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: StyleProps & ComponentProps<"button">) {
  return <button type={type} {...rest} className={buttonClasses({ variant, size }, className)} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: StyleProps & ComponentProps<typeof Link>) {
  return <Link {...rest} className={buttonClasses({ variant, size }, className)} />;
}
