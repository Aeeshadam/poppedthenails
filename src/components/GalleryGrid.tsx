"use client";

import Image from "next/image";
import { useState } from "react";
import { PhotoViewer } from "@/components/PhotoViewer";
import { GRID_SHAPES } from "@/components/shapes";
import type { GalleryPhoto } from "@/lib/gallery";

/** Photos in the first row on desktop load straight away; the rest load as you scroll. */
const EAGER_COUNT = 3;

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [viewing, setViewing] = useState<number | null>(null);

  return (
    <>
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            className={`relative aspect-[3/4] overflow-hidden bg-lilac ${GRID_SHAPES[i % GRID_SHAPES.length]}`}
          >
            <button type="button" onClick={() => setViewing(i)} className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent">
              <Image
                src={photo.thumbUrl}
                alt={`View larger: ${photo.alt}`}
                fill
                unoptimized
                loading={i < EAGER_COUNT ? "eager" : undefined}
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <PhotoViewer photos={photos} index={viewing} onChange={setViewing} />
    </>
  );
}
