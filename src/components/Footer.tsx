import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";
import { Logo } from "./Logo";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/book", label: "Book now" },
  { href: "/terms", label: "Terms & conditions" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-8">
        <Logo />
        <nav aria-label="Footer" className="mt-5">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-white/10">
                <Link href={link.href} className="flex min-h-12 items-center font-medium hover:text-lilac">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={INSTAGRAM_URL}
          className="mt-4 inline-flex min-h-11 items-center text-[15px] text-lilac underline underline-offset-4 hover:text-white"
        >
          Instagram @{INSTAGRAM_HANDLE}
        </a>
        <p className="mt-2 text-[13px] text-white/60">© {year} poppedthenail</p>
      </div>
    </footer>
  );
}
