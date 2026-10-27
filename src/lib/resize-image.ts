import { FULL_LONG_SIDE, fitSize, THUMB_SHORT_SIDE } from "./gallery";

async function toJpeg(image: ImageBitmap, max: number, side: "short" | "long", quality: number): Promise<Blob> {
  const { width, height } = fitSize(image.width, image.height, max, side);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) throw new Error("Couldn't read that photo.");
  return blob;
}

/** Runs in her browser: turns a big phone photo into a small thumbnail and a full-size JPEG. */
export async function resizePhoto(file: File): Promise<{ thumb: Blob; full: Blob }> {
  const image = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    return {
      thumb: await toJpeg(image, THUMB_SHORT_SIDE, "short", 0.8),
      full: await toJpeg(image, FULL_LONG_SIDE, "long", 0.82),
    };
  } finally {
    image.close();
  }
}
