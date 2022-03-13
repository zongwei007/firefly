import type { NextPage } from 'next';
import styles from './style.module.css';
import { Icon } from 'components';
import Link from 'next/link';
import AppCollection from './app/AppCollection';
import BookmarkCollection from './bookmark/BookmarkCollection';
import Clock from './clock/Clock';
import Filter from './filter/Filter';
import Weather from './weather/Weather';

export type HomeProps = { timestamp: number };

const Home: NextPage<HomeProps> = props => {
  return (
    <div className="no-select">
      <Filter />
      <header className={styles.header}>
        <Clock defaultValue={props.timestamp} />
        <Weather className={styles.weather} />
      </header>
      <main>
        <AppCollection className={styles.apps} />
        <BookmarkCollection className={styles.bookmarks} />
        <div className={styles.toolbar}>
          <Link href="/settings" shallow={true}>
            <a className={styles.icon}>
              <Icon type="cog-outline" width={35} height={35} />
            </a>
          </Link>
          <Link href="/help" shallow={true}>
            <a className={styles.icon}>
              <Icon type="help-circle-outline" width={35} height={35} />
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
