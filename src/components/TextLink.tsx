import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkStyle = {
  /** Sits inside a sentence and keeps the line height (no 44px box). */
  inline?: boolean;
  /** Regular weight, for secondary links like "Sign out". */
  quiet?: boolean;
};

/** Underlined accent link style. Block links get a 44px touch target. */
export function textLinkClasses({ inline = false, quiet = false }: TextLinkStyle = {}, extra = "") {
  const box = inline ? "" : "inline-flex min-h-11 items-center";
  const weight = quiet ? "" : "font-semibold";
  return `${box} ${weight} text-accent underline underline-offset-4 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-accent ${extra}`;
}

export function TextLink({ inline, quiet, className = "", ...rest }: ComponentProps<typeof Link> & TextLinkStyle) {
  return <Link {...rest} className={textLinkClasses({ inline, quiet }, className)} />;
}
