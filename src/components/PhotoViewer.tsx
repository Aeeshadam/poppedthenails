"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { IconButton } from "@/components/IconButton";
import { ChevronLeft, ChevronRight, Close } from "@/components/icons";
import type { GalleryPhoto } from "@/lib/gallery";

type PhotoViewerProps = {
  photos: GalleryPhoto[];
  /** The photo on screen, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Full-screen view of one photo. Swipe or use the arrows to move; Esc or Close to leave. */
export function PhotoViewer({ photos, index, onChange }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const photo = index === null ? undefined : photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (photo && !dialog?.open) dialog?.showModal();
    if (!photo && dialog?.open) dialog.close();
  }, [photo]);

  function go(direction: 1 | -1) {
    if (index !== null) onChange((index + direction + photos.length) % photos.length);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo"
      onClose={() => onChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-white backdrop:bg-ink"
    >
      {photo && index !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-2">
            <p aria-live="polite" className="text-[15px]">
              {index + 1} of {photos.length}
            </p>
            <IconButton label="Close" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => onChange(null)}>
              <Close />
            </IconButton>
          </div>
          <div
            className="relative flex-1 touch-pan-y"
            onPointerDown={(e) => (swipeStart.current = e.clientX)}
            onPointerUp={(e) => {
              const start = swipeStart.current;
              swipeStart.current = null;
              if (start !== null && Math.abs(e.clientX - start) > 50) go(e.clientX < start ? 1 : -1);
            }}
          >
            <Image src={photo.fullUrl} alt={photo.alt} fill unoptimized sizes="100vw" className="object-contain" />
          </div>
          {photos.length > 1 && (
            <div className="flex justify-center gap-4 px-4 py-4">
              <IconButton label="Previous photo" onClick={() => go(-1)} className="text-ink">
                <ChevronLeft />
              </IconButton>
              <IconButton label="Next photo" onClick={() => go(1)} className="text-ink">
                <ChevronRight />
              </IconButton>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
