'use client';

import { PropsWithChildren, useState } from 'react';
import { SWRConfig } from 'swr';

import { SettingProvider } from '@/hooks';

import Filter from './components/filter/Filter';
import FavoriteCollection from './components/bookmark/FavoriteCollection';
import BookmarkCollection from './components/bookmark/BookmarkCollection';

import ClockBar from './components/clock/ClockBar';
import styles from './page.module.css';

type HomeProps = PropsWithChildren<{
  setting: ISetting;
  weather: IWeather | null;
  bookmarks: IBookmarkConfiguration;
  now: number;
}>;

function Home({ children, setting, weather, bookmarks, now }: HomeProps) {
  const [filter, setFilter] = useState('');

  return (
    <SettingProvider value={setting}>
      <div className="no-select">
        <Filter value={filter} onFilter={value => setFilter(value)} />
        <header className={styles.header}>
          <SWRConfig value={{ fallback: { '/api/weather': weather } }}>
            <ClockBar now={now} />
          </SWRConfig>
        </header>
        <main>
          {setting?.ui.favorite.enable && !filter ? (
            <FavoriteCollection className={styles.bookmarks} value={bookmarks} />
          ) : null}
          {setting?.ui.bookmark.enable ? (
            <BookmarkCollection className={styles.bookmarks} filter={filter} value={bookmarks} />
          ) : null}
        </main>
        {setting?.ui.footer ? (
          <footer>
            <div dangerouslySetInnerHTML={{ __html: setting.ui.footer }} />
          </footer>
        ) : null}
        {children}
      </div>
    </SettingProvider>
  );
}

export default Home;
