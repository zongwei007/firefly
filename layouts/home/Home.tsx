import type { NextPage } from 'next';
import styles from './Home.module.css';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import { AppCollection, BookmarkCollection, Clock, Filter, Weather } from 'components';

export type HomeProps = PropsWithChildren<{
  timestamp: number;
  weather: WeatherResponse;
}>;

const Home: NextPage<HomeProps> = props => {
  return (
    <div className={classNames(styles.container, 'no-select')}>
      <Filter />
      <header className={styles.header}>
        <Clock defaultValue={props.timestamp} />
        <Weather className={styles.weather} defaultValue={props.weather} />
      </header>
      <main>
        <AppCollection className={styles.apps} />
        <BookmarkCollection className={styles.bookmarks} />
      </main>
    </div>
  );
};

export default Home;
