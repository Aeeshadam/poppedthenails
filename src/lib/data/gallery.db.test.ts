// Runs against the real database (npm run test:db) and removes what it adds.
import { describe, expect, it } from "vitest";
import { addGalleryPhoto, deleteGalleryPhoto, getGalleryPhotos } from "./gallery";

const jpeg = () => new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], { type: "image/jpeg" });

describe("gallery photos (real database)", () => {
  it("adds a photo newest first with both files, then deletes it", async () => {
    await addGalleryPhoto({ thumb: jpeg(), full: jpeg(), alt: "Test photo" });
    const [newest] = await getGalleryPhotos(1);
    expect(newest?.alt).toBe("Test photo");

    expect((await fetch(newest!.thumbUrl)).ok).toBe(true);
    expect((await fetch(newest!.fullUrl)).ok).toBe(true);

    await deleteGalleryPhoto(newest!.id);
    expect((await getGalleryPhotos()).map((p) => p.id)).not.toContain(newest!.id);
  });
});
