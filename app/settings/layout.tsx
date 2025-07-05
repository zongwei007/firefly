'use client';

import { Affix } from '@/components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';
import TabContainer from './components/tabs/TabContainer';
import styles from './style.module.css';

export type SettingPanelProps = {
  user: IToken | null;
  settings: ISetting;
  bookmarks: IBookmarkCollection;
  disableLogin: boolean;
};

export default function SettingLayout({ children }: PropsWithChildren<unknown>) {
  const pathname = usePathname();

  const tabs = [
    {
      id: 'bookmark',
      label: '书签',
      defaultActive: true,
    },
    /*{ id: 'theme', label: '主题', children: <Theme /> },*/
    {
      id: 'weather',
      label: '天气',
    },
    {
      id: 'search',
      label: '搜索',
    },
    {
      id: 'ui',
      label: '界面',
    },
    {
      id: 'about',
      label: '关于',
    },
  ];

  return (
    <div className={styles.settings}>
      <Affix paddingTop={15} tag="header">
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
      <TabContainer
        affix={{ top: 75, paddingTop: 75 }}
        className="clearfix"
        tag="main"
        tabs={tabs}
        activeKey={pathname.replace('/settings/', '')}>
        {children}
      </TabContainer>
      <ToastContainer />
    </div>
  );
}
