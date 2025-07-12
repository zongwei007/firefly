import { logout } from '@/actions/auth';
import { getUserInfo } from '@/infrastructure/auth';
import * as settingService from '@/actions/setting';
import * as bookmarkService from '@/actions/bookmark';
import About from './About';

export default async function AboutPage() {
  const user = await getUserInfo();
  const settings = await settingService.get();
  const bookmarks = await bookmarkService.list(user == null);

  return <About user={user} settings={settings} bookmarks={bookmarks} onLogout={logout} />;
}
