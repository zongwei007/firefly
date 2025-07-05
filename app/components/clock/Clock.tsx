'use client';

import { useSetting, useWeather } from '@/hooks';
import classNames from 'classnames';
import type { Locale } from 'date-fns';
import { differenceInMinutes, format as formatDateTime, isAfter, isBefore, parse as parseDateTime } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import styles from './style.module.css';

type ClockProps = { className?: string; defaultValue: number; locale?: Locale };

function Clock({ className, defaultValue, locale = zhCN }: ClockProps) {
  const config = useSetting();
  const { data: weather } = useWeather();
  const timestamp = useTimestamp(defaultValue);

  
  let welcome = '';
  const titles = config?.ui.clock.welcome.split(';') || [];
  
  if (weather) {
    const { sunrise, sunset } = weather.today;
    const sunriseTime = parseDateTime(sunrise, 'HH:mm', timestamp);
    const sunsetTime = parseDateTime(sunset, 'HH:mm', timestamp);

    if (isAfter(timestamp, sunriseTime) && isBefore(timestamp, sunsetTime)) {
      const duration = differenceInMinutes(sunsetTime, sunriseTime, { roundingMethod: 'floor' });
      const diff = differenceInMinutes(timestamp, sunriseTime, { roundingMethod: 'floor' });
      const pos = Math.floor((diff / duration) * titles.length);
      welcome = titles[pos];
    } else {
      welcome = titles[titles.length - 1];
    }
  }

  return (
    <div className={classNames(className, styles.clock)}>
      <p>
        <span>{formatDateTime(timestamp, 'PPPP', { locale })}</span>
        <span>{formatDateTime(timestamp, 'HH:mm:ss', { locale })}</span>
      </p>
      <h1>{welcome}</h1>
    </div>
  );
}

function useTimestamp(defaultTimestamp: number) {
  const [, forceUpdate] = useState(Symbol());
  const timestamp = useRef(defaultTimestamp);
  const prevStamp = useRef(Date.now());
  const handle = useRef<NodeJS.Timeout>(null);

  const updateTimestamp = () =>
    setTimeout(() => {
      timestamp.current = timestamp.current + Date.now() - prevStamp.current;
      prevStamp.current = Date.now();
      forceUpdate(Symbol());

      handle.current = updateTimestamp();
    }, 200);

  useIsomorphicLayoutEffect(() => {
    handle.current = updateTimestamp();

    return () => {
      if (handle.current) {
        clearTimeout(handle.current);
      }
    };
  }, []);

  return timestamp.current;
}

export default Clock;
