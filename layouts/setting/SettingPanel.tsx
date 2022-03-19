import type { FC } from 'react';
import { useMemo, useCallback } from 'react';
import styles from './style.module.css';
import Link from 'next/link';

import TabContainer from './tabs/TabContainer';
import About from './about/About';
import Theme from './theme/Theme';
import Weather from './weather/Weather';
import Search from './search/Search';
import UserInterface from './interface/UserInterface';
import { useApps, useBookmarks, useSettings } from 'hooks';
import { Spinner } from 'components';

export type SettingPanelProps = { user: IToken };

const SettingPanel: FC<SettingPanelProps> = ({ user }) => {
  const apps = useApps();
  const bookmarks = useBookmarks();
  const settings = useSettings();
  const loading = apps.isLoading || bookmarks.isLoading || settings.isLoading;

  const handleSettingChange = useCallback(
    (data: Partial<ISetting>) => settings.mutate({ ...settings.data, ...data }),
    [settings.data]
  );

  const tabs = useMemo(
    () => [
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
        children: settings.data ? <UserInterface defaultValue={settings.data!.ui} onChange={handleSettingChange} /> : null,
      },
      {
        id: 'about',
        label: '关于',
        children:
          apps.data && bookmarks.data && settings.data ? (
            <About user={user} apps={apps.data} bookmarks={bookmarks.data} settings={settings.data} />
          ) : null,
        defaultActive: true,
      },
    ],
    [user, apps.isLoading, bookmarks.isLoading, handleSettingChange]
  );

  if (apps.error || bookmarks.error || settings.error) {
    console.error(apps.error, bookmarks.error);
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
