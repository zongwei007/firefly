import type { FC } from 'react';
import styles from './style.module.css';
import Link from 'next/link';
import { useBookmarks, useSettings } from 'hooks';
import { Affix, Spinner } from 'components';

import About from './about/About';
import Bookmark from './bookmark/Bookmark';
import Search from './search/Search';
import TabContainer from './tabs/TabContainer';
// import Theme from './theme/Theme';
import UserInterface from './interface/UserInterface';
import Weather from './weather/Weather';

export type SettingPanelProps = { user: IToken | null; disableLogin: boolean };

const SettingPanel: FC<SettingPanelProps> = ({ user, disableLogin }) => {
  const bookmarks = useBookmarks();
  const settings = useSettings();
  const loading = bookmarks.isLoading || settings.isLoading;

  const handleBookmarkChange = (data: IBookmarkCollection) => bookmarks.mutate({ ...bookmarks.data, ...data });
  const handleSettingChange = (data: Partial<ISetting>) => settings.mutate({ ...settings.data, ...data });

  const tabs = [
    {
      id: 'bookmarks',
      label: '书签',
      children: bookmarks.data ? (
        <Bookmark defaultValue={bookmarks.data} onChange={handleBookmarkChange} disableLogin={disableLogin} />
      ) : null,
      defaultActive: true,
    },
    /*{ id: 'theme', label: '主题', children: <Theme /> },*/
    {
      id: 'weather',
      label: '天气',
      children: settings.data ? <Weather defaultValue={settings.data!.weather} onChange={handleSettingChange} /> : null,
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
    },
  ];

  if (bookmarks.error || settings.error) {
    console.error(bookmarks.error || settings.error);
    return null;
  }

  return (
    <div className={styles.settings}>
      <Affix offsetTop={15} tag="header">
        {affix => (
          <>
            {affix ? <h3>应用设置</h3> : <h1>应用设置</h1>}
            <p>
              <Link href="/" shallow>
                返回
              </Link>
            </p>
          </>
        )}
      </Affix>
      <Spinner loading={loading} />
      {loading ? null : <TabContainer affix={{ offsetTop: 75 }} className="clearfix" tag="main" tabs={tabs} />}
    </div>
  );
};

export default SettingPanel;
