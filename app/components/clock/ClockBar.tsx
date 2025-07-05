'use client';

import Clock from './Clock';
import Weather from './Weather';

import styles from './style.module.css';

export default function ClockBar({ now }: { now: number }) {
  return (
    <>
      <Clock className={styles.clock} defaultValue={now} />
      <Weather className={styles.weather} />
    </>
  );
}
