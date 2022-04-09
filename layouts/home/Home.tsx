// noinspection HtmlUnknownTarget

import type { NextPage } from 'next';
import { Icon } from 'components';
import Link from 'next/link';
import { mdiCogOutline } from '@mdi/js';
import { useState } from 'react';
import FavoriteCollection from './bookmark/FavoriteCollection';
import BookmarkCollection from './bookmark/BookmarkCollection';
import Clock from './clock/Clock';
import Filter from './filter/Filter';
import Weather from './weather/Weather';
import { useSettings } from 'hooks';
import styles from './style.module.css';

export type HomeProps = { timestamp: number; anonymous: boolean };

const Home: NextPage<HomeProps> = props => {
  const { data: config } = useSettings();
  const [filter, setFilter] = useState('');

  return (
    <div className="no-select">
      <Filter value={filter} onFilter={value => setFilter(value)} />
      <header className={styles.header}>
        {config?.ui.clock.enable ? <Clock defaultValue={props.timestamp} /> : null}
        <Weather className={styles.weather} />
      </header>
      <main>
        {config?.ui.favorite.enable && !filter ? (
          <FavoriteCollection className={styles.favorites} anonymous={props.anonymous} />
        ) : null}
        {config?.ui.bookmark.enable ? (
          <BookmarkCollection className={styles.bookmarks} filter={filter} anonymous={props.anonymous} />
        ) : null}
        <div className={styles.toolbar}>
          <Link href="/settings" shallow={true}>
            <a className={styles.icon}>
              <Icon path={mdiCogOutline} size="30px" />
            </a>
          </Link>
        </div>
      </main>
      {config?.ui.footer ? (
        <footer>
          <div dangerouslySetInnerHTML={{ __html: config.ui.footer }} />
        </footer>
      ) : null}
    </div>
  );
};

export default Home;
