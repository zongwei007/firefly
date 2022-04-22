import type { FC } from 'react';
import { useRef, useState } from 'react';
import type { Locale } from 'date-fns';
import { differenceInMinutes, format as formatDateTime, isAfter, isBefore, parse as parseDateTime } from 'date-fns';
import classNames from 'classnames';
import { useIsomorphicLayoutEffect } from 'react-use';
import { zhCN } from 'date-fns/locale';
import styles from './style.module.css';
import { useSettings, useWeather } from 'hooks';

type ClockProps = { className?: string; defaultValue: number; locale?: Locale };

const Clock: FC<ClockProps> = ({ className, defaultValue, locale = zhCN }) => {
  const { data: config } = useSettings();
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
        <span>{formatDateTime(timestamp, 'HH:mm:ss')}</span>
      </p>
      <h1>{welcome}</h1>
    </div>
  );
};

function useTimestamp(defaultTimestamp: number) {
  const [, forceUpdate] = useState(Symbol());
  const timestamp = useRef(defaultTimestamp);
  const prevStamp = useRef(Date.now());
  const handle = useRef<NodeJS.Timeout>();

  const updateTimestamp = () =>
    setTimeout(() => {
      timestamp.current = timestamp.current + Date.now() - prevStamp.current;
      prevStamp.current = Date.now();
      forceUpdate(Symbol());

      handle.current = updateTimestamp();
    }, 500);

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
