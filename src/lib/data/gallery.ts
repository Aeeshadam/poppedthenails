import "server-only";
import { DEFAULT_ALT, type GalleryPhoto } from "@/lib/gallery";
import { createServerClient } from "@/lib/supabase/server";

const BUCKET = "gallery";
const thumbPath = (id: string) => `${id}/thumb.jpg`;
const fullPath = (id: string) => `${id}/full.jpg`;

function publicUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** Newest first. Pass a limit for the home page. */
export async function getGalleryPhotos(limit?: number): Promise<GalleryPhoto[]> {
  let query = createServerClient().from("gallery_photos").select("id, alt").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data.map((p) => ({
    id: p.id,
    alt: p.alt || DEFAULT_ALT,
    thumbUrl: publicUrl(thumbPath(p.id)),
    fullUrl: publicUrl(fullPath(p.id)),
  }));
}

/** Uploads both sizes, then adds the row. If the row fails, the files are removed again. */
export async function addGalleryPhoto(photo: { thumb: Blob; full: Blob; alt: string }): Promise<void> {
  const db = createServerClient();
  const id = crypto.randomUUID();
  const options = { contentType: "image/jpeg", cacheControl: "31536000" };
  const storage = db.storage.from(BUCKET);

  for (const [path, file] of [[thumbPath(id), photo.thumb], [fullPath(id), photo.full]] as const) {
    const { error } = await storage.upload(path, file, options);
    if (error) {
      await storage.remove([thumbPath(id), fullPath(id)]);
      throw error;
    }
  }

  const { error } = await db.from("gallery_photos").insert({ id, alt: photo.alt || null });
  if (error) {
    await storage.remove([thumbPath(id), fullPath(id)]);
    throw error;
  }
}

export async function updateGalleryAlt(id: string, alt: string): Promise<void> {
  const { error } = await createServerClient().from("gallery_photos").update({ alt: alt || null }).eq("id", id);
  if (error) throw error;
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const db = createServerClient();
  const { error } = await db.from("gallery_photos").delete().eq("id", id);
  if (error) throw error;
  await db.storage.from(BUCKET).remove([thumbPath(id), fullPath(id)]);
}
