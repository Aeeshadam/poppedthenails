import { requireAdmin } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { settings } from "@/lib/dummy";

export default async function AdminSettingsPage() {
  await requireAdmin();
  return <SettingsForm settings={settings} />;
}
