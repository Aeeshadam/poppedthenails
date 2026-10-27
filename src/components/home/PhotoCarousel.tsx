"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { IconButton } from "@/components/IconButton";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { PhotoViewer } from "@/components/PhotoViewer";
import { ARCH } from "@/components/shapes";
import { TextLink } from "@/components/TextLink";
import type { GalleryPhoto } from "@/lib/gallery";

const INTERVAL_MS = 4000;
/** Photos that can be on screen at first load (four on desktop) load straight away. */
const EAGER_COUNT = 4;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function step(track: HTMLElement, direction: 1 | -1) {
  const first = track.children[0] as HTMLElement | undefined;
  const second = track.children[1] as HTMLElement | undefined;
  const width = first && second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
  const end = track.scrollWidth - track.clientWidth - 2;

  if (direction === 1 && track.scrollLeft >= end) track.scrollTo({ left: 0, behavior: "smooth" });
  else if (direction === -1 && track.scrollLeft <= 2) track.scrollTo({ left: end + 2, behavior: "smooth" });
  else track.scrollBy({ left: direction * width, behavior: "smooth" });
}

/**
 * Swiping or tapping an arrow pauses autoplay; Play restarts it. Autoplay
 * never runs when the device asks for reduced motion (WCAG 2.2.2).
 */
export function PhotoCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState(true);
  const [viewing, setViewing] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const autoplay = playing && viewing === null && !reducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => trackRef.current && step(trackRef.current, 1), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [autoplay]);

  function move(direction: 1 | -1) {
    setPlaying(false);
    if (trackRef.current) step(trackRef.current, direction);
  }

  return (
    <section aria-roledescription="carousel" aria-label="Recent sets" className="mx-auto mt-10 max-w-5xl md:mt-16 md:px-6">
      <ul
        ref={trackRef}
        onPointerDown={() => setPlaying(false)}
        aria-live={autoplay ? "off" : "polite"}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${photos.length}`}
            className={`relative aspect-[3/4] w-[64%] max-w-[300px] shrink-0 snap-start overflow-hidden ${ARCH} bg-lilac md:w-[calc(25%-12px)]`}
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

      <div className="mt-2 flex items-center justify-between px-6 md:mt-4 md:px-0">
        <div className="flex items-center gap-2">
          {/* No swipe with a mouse, so desktop gets arrows. */}
          <div className="hidden gap-2 md:flex">
            <IconButton label="Previous photos" onClick={() => move(-1)}>
              <ChevronLeft />
            </IconButton>
            <IconButton label="Next photos" onClick={() => move(1)}>
              <ChevronRight />
            </IconButton>
          </div>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={!playing}
              className="inline-flex min-h-11 items-center gap-2 text-[15px] text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span aria-hidden="true" className="inline-flex w-3 justify-center text-xs">
                {playing ? "❚❚" : "▶"}
              </span>
              {playing ? "Pause" : "Play"}
              <span className="sr-only"> photo slideshow</span>
            </button>
          )}
        </div>
        <TextLink href="/gallery" className="text-[15px]">
          Gallery →
        </TextLink>
      </div>
      <PhotoViewer photos={photos} index={viewing} onChange={setViewing} />
    </section>
  );
}
