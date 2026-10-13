import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data/admin-settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  return <SettingsForm settings={await getSettings()} />;
}
