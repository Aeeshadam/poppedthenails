import { GalleryManager } from "@/components/admin/GalleryManager";
import { requireAdmin } from "@/lib/auth";
import { getGalleryPhotos } from "@/lib/data/gallery";

export default async function AdminGalleryPage() {
  await requireAdmin();
  return <GalleryManager photos={await getGalleryPhotos()} />;
}
