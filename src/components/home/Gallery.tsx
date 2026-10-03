import Image from "next/image";
import { TextLink } from "@/components/TextLink";

// Corner shapes for the 2×2 gallery, as in the design: arch, soft, soft, upside-down arch.
const shapes = [
  "rounded-t-[999px] rounded-b-[20px]",
  "rounded-[20px]",
  "rounded-[20px]",
  "rounded-t-[20px] rounded-b-[999px]",
];

type GalleryProps = {
  photos: { src: string; alt: string }[];
  instagramUrl: string;
};

export function Gallery({ photos, instagramUrl }: GalleryProps) {
  return (
    <section aria-labelledby="gallery-heading">
      <div className="flex items-baseline justify-between">
        <h2 id="gallery-heading" className="font-serif text-[30px]">
          Fresh sets
        </h2>
        <TextLink href={instagramUrl} className="text-sm">
          Instagram
        </TextLink>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {photos.map((photo, i) => (
          <li
            key={photo.src}
            className={`relative aspect-square overflow-hidden bg-lilac ${shapes[i] ?? ""}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 240px, 50vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
