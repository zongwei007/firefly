import type { FC } from 'react';
import { useMemo } from 'react';
import styles from './style.module.css';
import Link from 'next/link';

import TabContainer from './tabs/TabContainer';
import About from './about/About';
import Theme from './theme/Theme';
import { useApps, useBookmarks } from 'hooks';
import { Spinner } from 'components';

export type SettingPanelProps = { user: IToken };

const SettingPanel: FC<SettingPanelProps> = ({ user }) => {
  const apps = useApps();
  const bookmarks = useBookmarks();
  const loading = apps.isLoading || bookmarks.isLoading;

  const tabs = useMemo(
    () => [
      { id: 'theme', label: '主题', children: <Theme /> },
      { id: 'weather', label: '天气', children: <div></div> },
      { id: 'search', label: '搜索', children: <div></div> },
      { id: 'ui', label: '界面', children: <div></div> },
      {
        id: 'about',
        label: '关于',
        children: <About user={user} apps={apps.data!} bookmarks={bookmarks.data!} />,
        defaultActive: true,
      },
    ],
    [user, apps.isLoading, bookmarks.isLoading]
  );

  if (apps.error || bookmarks.error) {
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
