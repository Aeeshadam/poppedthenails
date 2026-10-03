import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "dark";
type Size = "md" | "lg";
type StyleProps = { variant?: Variant; size?: Size };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover",
  dark: "bg-ink text-white hover:bg-accent-hover active:bg-accent-hover",
};

// md is the 44px minimum touch target; lg is the spec's 56px pill.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-14 px-8 text-[15px]",
};

function classes({ variant = "primary", size = "lg" }: StyleProps, extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

/** Pill-shaped <button>. */
export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: StyleProps & ComponentProps<"button">) {
  return <button type={type} {...rest} className={classes({ variant, size }, className)} />;
}

/** Pill-shaped link that looks like a Button. */
export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: StyleProps & ComponentProps<typeof Link>) {
  return <Link {...rest} className={classes({ variant, size }, className)} />;
}
