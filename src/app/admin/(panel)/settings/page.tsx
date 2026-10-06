import { SettingsForm } from "@/components/admin/SettingsForm";
import { settings } from "@/lib/dummy";

export default function AdminSettingsPage() {
  return <SettingsForm settings={settings} />;
}
