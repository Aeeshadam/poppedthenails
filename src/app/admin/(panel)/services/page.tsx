import { ServicesManager } from "@/components/admin/ServicesManager";
import { services } from "@/lib/dummy";

export default function AdminServicesPage() {
  return <ServicesManager services={services} />;
}
