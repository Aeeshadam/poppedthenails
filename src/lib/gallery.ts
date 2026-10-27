import { z } from "zod";

/** The home page carousel shows this many of the newest photos. */
export const HOME_PHOTO_COUNT = 10;
export const DEFAULT_ALT = "Nail set by poppedthenail";

/** Thumbnails fill a ~300px-wide tile on a 2× screen; full size fills a phone or laptop screen. */
export const THUMB_SHORT_SIDE = 600;
export const FULL_LONG_SIDE = 1600;

export type GalleryPhoto = { id: string; alt: string; thumbUrl: string; fullUrl: string };

/** Scales width × height down (never up) so the chosen side is at most `max`. */
export function fitSize(width: number, height: number, max: number, side: "short" | "long") {
  const current = side === "short" ? Math.min(width, height) : Math.max(width, height);
  const scale = Math.min(1, max / current);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

const jpeg = (maxBytes: number) =>
  z
    .instanceof(File)
    .refine((f) => f.type === "image/jpeg", "Photos must be JPEG.")
    .refine((f) => f.size > 0 && f.size <= maxBytes, "That photo is too large.");

export const photoUploadSchema = z.object({
  thumb: jpeg(500 * 1024),
  full: jpeg(3 * 1024 * 1024),
  alt: z.string().trim().max(200, "Keep the description under 200 characters."),
});

export const photoAltSchema = z.object({
  id: z.uuid(),
  alt: z.string().trim().max(200, "Keep the description under 200 characters."),
});
