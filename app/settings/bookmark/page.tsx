import * as bookmarkService from '@/actions/bookmark';
import { getUserInfo } from '@/infrastructure/auth';
import getConfiguration from '@/infrastructure/configuration';
import Bookmark from './Bookmark';

export default async function SettingsPage() {
  const { firefly } = getConfiguration();
  const user = await getUserInfo();
  const bookmarks = await bookmarkService.list(user == null);

  async function handleBookmarkChange(config: IBookmarkConfiguration) {
    'use server';

    await bookmarkService.update(config);
  }

  return (
    <Bookmark
      defaultValue={bookmarks}
      onChange={handleBookmarkChange}
      disableLogin={firefly.disableLogin}
    />
  );
}
