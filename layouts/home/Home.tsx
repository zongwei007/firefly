// noinspection HtmlUnknownTarget

import type { NextPage } from 'next';
import { Icon } from 'components';
import Link from 'next/link';
import FavoriteCollection from './bookmark/FavoriteCollection';
import BookmarkCollection from './bookmark/BookmarkCollection';
import Clock from './clock/Clock';
import Filter from './filter/Filter';
import Weather from './weather/Weather';
import { useSettings } from 'hooks';
import styles from './style.module.css';

export type HomeProps = { timestamp: number };

const Home: NextPage<HomeProps> = props => {
  const { data: config } = useSettings();

  return (
    <div className="no-select">
      <Filter />
      <header className={styles.header}>
        {config?.ui.clock.enable ? <Clock defaultValue={props.timestamp} /> : null}
        <Weather className={styles.weather} />
      </header>
      <main>
        {config?.ui.favorite.enable ? <FavoriteCollection className={styles.favorites} /> : null}
        {config?.ui.bookmark.enable ? <BookmarkCollection className={styles.bookmarks} /> : null}
        <div className={styles.toolbar}>
          <Link href="/settings" shallow={true}>
            <a className={styles.icon}>
              <Icon type="cog-outline" width={30} height={30} layout="fixed" />
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
