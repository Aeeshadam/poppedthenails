import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { ARCH } from "@/components/shapes";
import { formatPounds } from "@/lib/money";

type HeroProps = {
  depositPounds: number;
  photo: { src: string; alt: string };
};

export function Hero({ depositPounds, photo }: HeroProps) {
  const intro = `Gel, BIAB and acrylics by appointment. ${formatPounds(depositPounds)} deposit to secure your time.`;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-6 md:pt-10">
      <div className={`relative flex h-[600px] flex-col justify-end overflow-hidden ${ARCH} bg-lilac md:grid md:h-auto md:grid-cols-2 md:items-center md:gap-12 md:overflow-visible md:rounded-none md:bg-transparent`}>
        <div className="absolute inset-0 md:relative md:order-2 md:h-[560px] md:overflow-hidden md:rounded-t-full md:rounded-b-card md:bg-lilac">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent from-40% via-ink/45 via-70% to-ink/90 md:hidden"
          />
        </div>

        <div className="relative p-6 md:order-1 md:p-0">
          <p className="font-script text-[30px] leading-none text-lilac md:text-[38px] md:text-accent">hey gorgeous</p>
          <h1 className="mt-3 font-serif text-[40px] leading-[1.05] text-white md:text-[56px] md:text-ink">
            Pretty nails,
            <br />
            <em className="text-lilac md:text-accent">happy you.</em>
          </h1>
          {/* The intro sits beside the photo on desktop and under the card on phones. */}
          <p className="mt-5 hidden max-w-sm text-[17px] leading-relaxed text-muted md:block">{intro}</p>
          {/* White button on the photo (phone), purple button beside it (desktop). */}
          <ButtonLink href="/book" variant="light" className="mt-6 w-full md:hidden">
            Book your slot <Heart />
          </ButtonLink>
          <div className="mt-8 hidden md:block">
            <ButtonLink href="/book">
              Book your slot <Heart />
            </ButtonLink>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-[300px] text-center text-[15px] leading-relaxed text-muted md:hidden">
        {intro}
      </p>
    </section>
  );
}
