import { ServicesManager } from "@/components/admin/ServicesManager";
import { requireAdmin } from "@/lib/auth";
import { getAllServices } from "@/lib/data/admin-services";

export default async function AdminServicesPage() {
  await requireAdmin();
  return <ServicesManager services={await getAllServices()} />;
}
