import type { FC } from 'react';
import { useState, useRef } from 'react';
import type { Locale } from 'date-fns';
import { format as formatDateTime } from 'date-fns';
import classNames from 'classnames';
import { useIsomorphicLayoutEffect } from 'react-use';
import { zhCN } from 'date-fns/locale';
import styles from './style.module.css';

type ClockProps = { className?: string; defaultValue: number; locale?: Locale };

const Clock: FC<ClockProps> = ({ className, defaultValue, locale = zhCN }) => {
  const timestamp = useTimestamp(defaultValue);

  return (
    <div className={classNames(className, styles.clock)}>
      <p>
        <span>{formatDateTime(timestamp, 'PPPP', { locale })}</span>
        <span style={{ paddingLeft: '0.5rem' }}>{formatDateTime(timestamp, 'HH:mm:ss')}</span>
      </p>
      <h1>你好</h1>
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
