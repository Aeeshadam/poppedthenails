import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { formatPounds } from "@/lib/money";

type HeroProps = {
  area: string;
  depositPounds: number;
  photo: { src: string; alt: string };
};

export function Hero({ area, depositPounds, photo }: HeroProps) {
  return (
    <section className="grid gap-8 pt-8 md:grid-cols-2 md:items-center md:gap-12 md:pt-12">
      <div>
        <p className="font-script text-[38px] leading-none text-accent">hey gorgeous</p>
        <p className="mt-4 text-[13px] uppercase tracking-[0.15em] text-muted">
          Nail studio · {area}
        </p>
        <h1 className="mt-4 font-serif text-[46px] leading-[1.05]">
          Pretty nails,
          <br />
          <em className="text-accent">happy you.</em>
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          Gel, BIAB and acrylics by appointment. Pick a time that suits you and secure it with
          a {formatPounds(depositPounds)} deposit.
        </p>
        <ButtonLink href="/book" className="mt-7 w-full md:w-auto">
          Book your slot <Heart />
        </ButtonLink>
      </div>
      <div className="relative aspect-[9/10] overflow-hidden rounded-t-[999px] rounded-b-[24px] bg-lilac">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="(min-width: 768px) 480px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
