import type { NextPage } from 'next';
import styles from './style.module.css';
import { Icon } from 'components';
import Link from 'next/link';
import AppCollection from './app/AppCollection';
import BookmarkCollection from './bookmark/BookmarkCollection';
import Clock from './clock/Clock';
import Filter from './filter/Filter';
import Weather from './weather/Weather';
import { useSettings } from 'hooks';

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
        {config?.ui.app.enable ? <AppCollection className={styles.apps} /> : null}
        {config?.ui.bookmark.enable ? <BookmarkCollection className={styles.bookmarks} /> : null}
        <div className={styles.toolbar}>
          <Link href="/settings" shallow={true}>
            <a className={styles.icon}>
              <Icon type="cog-outline" width={35} height={35} />
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
