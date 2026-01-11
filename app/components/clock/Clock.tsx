'use client';

import { useSetting, useWeather } from '@/hooks';
import classNames from 'classnames';
import type { Locale } from 'date-fns';
import { differenceInMinutes, format as formatDateTime, isAfter, isBefore, parse as parseDateTime } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useRef, useState, useMemo, useCallback } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import styles from './style.module.css';

type ClockProps = { className?: string; defaultValue: number; locale?: Locale };

function Clock({ className, defaultValue, locale = zhCN }: ClockProps) {
  const config = useSetting();
  const { data: weather } = useWeather();
  const timestamp = useTimestamp(defaultValue);

  const titles = useMemo(
    () => config?.ui.clock.welcome.split(';') || [],
    [config?.ui.clock.welcome]
  );

  const welcome = useMemo(() => {
    if (!weather) return '';
    
    const { sunrise, sunset } = weather.today;
    const sunriseTime = parseDateTime(sunrise, 'HH:mm', timestamp);
    const sunsetTime = parseDateTime(sunset, 'HH:mm', timestamp);

    if (isAfter(timestamp, sunriseTime) && isBefore(timestamp, sunsetTime)) {
      const duration = differenceInMinutes(sunsetTime, sunriseTime, { roundingMethod: 'floor' });
      const diff = differenceInMinutes(timestamp, sunriseTime, { roundingMethod: 'floor' });
      const pos = Math.floor((diff / duration) * titles.length);
      return titles[pos] || '';
    } else {
      return titles[titles.length - 1] || '';
    }
  }, [weather, timestamp, titles]);

  const formattedDate = useMemo(
    () => formatDateTime(timestamp, 'PPPP', { locale }),
    [timestamp, locale]
  );
  
  const formattedTime = useMemo(
    () => formatDateTime(timestamp, 'HH:mm:ss', { locale }),
    [timestamp, locale]
  );

  return (
    <div className={classNames(className, styles.clock)}>
      <p>
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </p>
      <h1>{welcome}</h1>
    </div>
  );
}

function useTimestamp(defaultTimestamp: number) {
  const [timestamp, setTimestamp] = useState(defaultTimestamp);
  const handle = useRef<NodeJS.Timeout>(null);

  const updateTimestamp = useCallback(() => {
    setTimestamp(Date.now());

    // 优化：根据当前时间调整更新频率
    const now = Date.now();
    const milliseconds = new Date(now).getMilliseconds();
    
    // 如果是整秒时刻，延迟1秒更新（显示秒数变化）
    // 否则延迟到下一个整秒
    if (milliseconds < 50) {
      // eslint-disable-next-line react-hooks/immutability
      handle.current = setTimeout(updateTimestamp, 1000);
    } else {
      handle.current = setTimeout(updateTimestamp, 1000 - milliseconds);
    }
  }, []);


  useIsomorphicLayoutEffect(() => {
    // 立即更新一次时间戳
    setTimestamp(Date.now());
    
    // 启动定时器
    updateTimestamp();

    return () => {
      if (handle.current) {
        clearTimeout(handle.current);
      }
    };
  }, [updateTimestamp]);

  return timestamp;
}

export default Clock;