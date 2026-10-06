import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { GRID_SHAPES } from "@/components/shapes";
import { TextLink } from "@/components/TextLink";
import { galleryPhotos, settings } from "@/lib/dummy";

export const metadata: Metadata = { title: "Gallery · poppedthenail" };

/** Photos in the first row on desktop load straight away; the rest load as you scroll. */
const EAGER_COUNT = 3;

export default function GalleryPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-10">
      <h1 className="font-serif text-title">Gallery</h1>
      <p className="mt-2 leading-relaxed text-muted">
        Recent sets from the studio. There&rsquo;s more on{" "}
        <TextLink inline href={`https://www.instagram.com/${settings.instagram_handle}`}>
          Instagram @{settings.instagram_handle}
        </TextLink>
        .
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {galleryPhotos.map((photo, i) => (
          <li
            key={photo.src}
            className={`relative aspect-[3/4] overflow-hidden bg-lilac ${GRID_SHAPES[i % GRID_SHAPES.length]}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading={i < EAGER_COUNT ? "eager" : undefined}
              sizes="(min-width: 768px) 320px, 50vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-10 max-w-column text-center">
        <p className="font-script text-[34px] leading-none text-accent">like what you see?</p>
        <ButtonLink href="/book" className="mt-5 w-full">
          Book your slot <Heart />
        </ButtonLink>
      </div>
    </div>
  );
}
