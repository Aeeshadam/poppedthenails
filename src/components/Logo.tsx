import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <Image src={logo} alt="poppedthenail home" className="h-auto w-[86px]" priority />
    </Link>
  );
}
