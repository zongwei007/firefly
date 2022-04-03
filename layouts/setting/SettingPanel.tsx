import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import styles from './style.module.css';
import Link from 'next/link';
import { useBookmarks, useSettings } from 'hooks';
import { Spinner } from 'components';

import About from './about/About';
import Bookmark from './bookmark/Bookmark';
import Search from './search/Search';
import TabContainer from './tabs/TabContainer';
import Theme from './theme/Theme';
import UserInterface from './interface/UserInterface';
import Weather from './weather/Weather';

export type SettingPanelProps = { user: IToken };

const SettingPanel: FC<SettingPanelProps> = ({ user }) => {
  const bookmarks = useBookmarks();
  const settings = useSettings();
  const loading = bookmarks.isLoading || settings.isLoading;

  const handleBookmarkChange = useCallback(
    (data: IBookmarkCollection) => bookmarks.mutate({ ...bookmarks.data, ...data }),
    [bookmarks.data]
  );

  const handleSettingChange = useCallback(
    (data: Partial<ISetting>) => settings.mutate({ ...settings.data, ...data }),
    [settings.data]
  );

  const tabs = useMemo(
    () => [
      {
        id: 'bookmarks',
        label: '书签',
        children: bookmarks.data ? <Bookmark defaultValue={bookmarks.data} onChange={handleBookmarkChange} /> : null,
      },
      { id: 'theme', label: '主题', children: <Theme /> },
      {
        id: 'weather',
        label: '天气',
        children: settings.data ? (
          <Weather defaultValue={settings.data!.weather} onChange={handleSettingChange} />
        ) : null,
      },
      {
        id: 'search',
        label: '搜索',
        children: settings.data ? <Search defaultValue={settings.data!.search} onChange={handleSettingChange} /> : null,
      },
      {
        id: 'ui',
        label: '界面',
        children: settings.data ? (
          <UserInterface defaultValue={settings.data!.ui} onChange={handleSettingChange} />
        ) : null,
      },
      {
        id: 'about',
        label: '关于',
        children:
          bookmarks.data && settings.data ? (
            <About user={user} bookmarks={bookmarks.data} settings={settings.data} />
          ) : null,
        defaultActive: true,
      },
    ],
    [user, bookmarks.isLoading, handleSettingChange]
  );

  if (bookmarks.error || settings.error) {
    console.error(bookmarks.error || settings.error);
    return null;
  }

  return (
    <div className={styles.settings}>
      <header>
        <h1>应用设置</h1>
        <p>
          <Link href="/" shallow>
            返回
          </Link>
        </p>
      </header>
      <Spinner loading={loading} />
      {loading ? null : <TabContainer className="clearfix" tag="main" tabs={tabs} />}
    </div>
  );
};

export default SettingPanel;
