// noinspection HtmlUnknownTarget

import type { NextPage } from 'next';
import { Icon } from 'components';
import Link from 'next/link';
import { mdiCogOutline, mdiLoginVariant } from '@mdi/js';
import { useState } from 'react';
import FavoriteCollection from './bookmark/FavoriteCollection';
import BookmarkCollection from './bookmark/BookmarkCollection';
import Clock from './clock/Clock';
import Filter from './filter/Filter';
import Weather from './weather/Weather';
import { useSettings } from 'hooks';
import styles from './style.module.css';

export type HomeProps = { timestamp: number; anonymous: boolean; disableLogin: boolean };

const Home: NextPage<HomeProps> = ({ anonymous, timestamp, disableLogin }) => {
  const { data: config } = useSettings();
  const [filter, setFilter] = useState('');

  return (
    <div className="no-select">
      <Filter value={filter} onFilter={value => setFilter(value)} />
      <header className={styles.header}>
        {config?.ui.clock.enable ? <Clock className={styles.clock} defaultValue={timestamp} /> : null}
        <Weather className={styles.weather} />
      </header>
      <main>
        {config?.ui.favorite.enable && !filter ? (
          <FavoriteCollection className={styles.bookmarks} anonymous={anonymous} />
        ) : null}
        {config?.ui.bookmark.enable ? (
          <BookmarkCollection className={styles.bookmarks} filter={filter} anonymous={anonymous} />
        ) : null}
      </main>
      {config?.ui.footer ? (
        <footer>
          <div dangerouslySetInnerHTML={{ __html: config.ui.footer }} />
        </footer>
      ) : null}
      <div className={styles.toolbar}>
        {anonymous && !disableLogin ? (
          <Link href="/login" shallow={true}>
            <a className={styles.icon} title="登录">
              <Icon path={mdiLoginVariant} size="30px" />
            </a>
          </Link>
        ) : null}
        <Link href="/settings" shallow={true}>
          <a className={styles.icon} title="设置">
            <Icon path={mdiCogOutline} size="30px" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Home;
