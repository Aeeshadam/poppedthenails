import type { Metadata } from "next";
import { connection } from "next/server";
import { ButtonLink } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { GalleryGrid } from "@/components/GalleryGrid";
import { TextLink } from "@/components/TextLink";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";
import { getGalleryPhotos } from "@/lib/data/gallery";

export const metadata: Metadata = { title: "Gallery · poppedthenail" };

export default async function GalleryPage() {
  await connection();
  const photos = await getGalleryPhotos();
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-10">
      <h1 className="font-serif text-title">Gallery</h1>
      <p className="mt-2 leading-relaxed text-muted">
        Recent sets from the studio. There&rsquo;s more on{" "}
        <TextLink inline href={INSTAGRAM_URL}>
          Instagram @{INSTAGRAM_HANDLE}
        </TextLink>
        .
      </p>

      {photos.length > 0 ? (
        <GalleryGrid photos={photos} />
      ) : (
        <p className="mt-8 rounded-card bg-surface p-6 text-center text-muted">New photos are coming soon.</p>
      )}

      <div className="mx-auto mt-10 max-w-column text-center">
        <p className="font-script text-[34px] leading-none text-accent">like what you see?</p>
        <ButtonLink href="/book" className="mt-5 w-full">
          Book your slot <Heart />
        </ButtonLink>
      </div>
    </div>
  );
}
