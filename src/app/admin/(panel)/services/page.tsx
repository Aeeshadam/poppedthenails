import { requireAdmin } from "@/lib/auth";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { services } from "@/lib/dummy";

export default async function AdminServicesPage() {
  await requireAdmin();
  return <ServicesManager services={services} />;
}
