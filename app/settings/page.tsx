import { permanentRedirect } from 'next/navigation';

export default async function SettingsPage() {
  permanentRedirect('/settings/bookmark');
}
