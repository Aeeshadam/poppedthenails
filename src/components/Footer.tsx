import { business } from "@/lib/dummy";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10">
        <Logo />
        <p className="text-sm text-white/80">{business.address}</p>
        <a
          href={business.instagramUrl}
          className="inline-flex min-h-11 w-fit items-center text-sm font-medium underline underline-offset-4 hover:text-lilac"
        >
          Instagram @{business.instagramHandle}
        </a>
        <p className="text-[13px] text-white/60">© poppedthenail</p>
      </div>
    </footer>
  );
}
