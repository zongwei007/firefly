'use client';

import { RemoteIcon } from '@/components';
import request from '@/infrastructure/request';
import { mdiClose } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import type { ChangeEventHandler, DetailedHTMLProps, FocusEvent, InputHTMLAttributes, RefObject } from 'react';
import { useRef, useState } from 'react';
import { useDebounce, useIsomorphicLayoutEffect } from 'react-use';
import Popup from 'reactjs-popup';
import type { PopupProps } from 'reactjs-popup/dist/types';
import useImmutableSWR from 'swr/immutable';
import styles from './style.module.css';

type IconData = {
  id: string;
  name: string;
  aliases: Array<string>;
  tags: Array<string>;
};

type IconSelectProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onClick' | 'defaultValue'
> &
  Pick<PopupProps, 'defaultOpen'> & {
    column?: number;
    row?: number;
    defaultValue?: string;
  };

const innerSize = 28;
const scrollWidth = 24;

function IconSelect({ onBlur, defaultOpen, defaultValue, column = 5, row = 5, ...props }: IconSelectProps) {
  const parentRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [filter, setFilter] = useState<string>();
  const [checked, setChecked] = useState(defaultValue);
  const { data: allIcons } = useImmutableSWR<IconData[]>('/assets/icon-meta.json', request);
  const [data, setData] = useState<IconData[]>(allIcons || []);

  useDebounce(
    () => {
      setData(filterIcons(allIcons || [], filter));
    },
    500,
    [allIcons, filter]
  );

  const virtual = useVirtualizer({
    count: Math.ceil(data.length / column),
    estimateSize: () => innerSize,
    getScrollElement: () => parentRef.current,
    overscan: row,
  });

  useIsomorphicLayoutEffect(() => {
    if (!allIcons) {
      return;
    }

    const idx = allIcons.findIndex(ele => ele.name === defaultValue);
    const pos = Math.floor(idx / column);

    if (pos > row) {
      virtual.scrollToIndex(pos);
    }
  }, [allIcons, defaultValue, row]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => setFilter(event.target.value);

  const handleClear = () =>
    setTimeout(() => onBlur?.({ target: { value: null } } as unknown as FocusEvent<HTMLInputElement>), 50);

  return (
    <Popup
      trigger={
        <div className={styles.input}>
          <input {...props} onChange={handleInputChange} value={filter} />
          <a className={styles.clear} onClick={handleClear}>
            <Icon path={mdiClose} size="20px" />
          </a>
        </div>
      }
      arrow={false}
      defaultOpen={defaultOpen}
      position="bottom left"
      onClose={() => onBlur?.({ target: { value: checked } } as unknown as FocusEvent<HTMLInputElement>)}>
      <div
        className={styles.parent}
        ref={parentRef}
        style={{ width: innerSize * column + scrollWidth, height: row * innerSize }}>
        <div className={styles.container} style={{ height: virtual.getTotalSize() }}>
          {virtual.getVirtualItems().map(virtualRow => {
            return data.slice(virtualRow.index * column, (virtualRow.index + 1) * column).map((ele, idx) => (
              <a
                key={ele.id}
                onClick={() => setChecked(ele.name)}
                title={ele.name}
                className={classNames(styles.icon, { [styles.checked]: checked === ele.name })}
                style={{
                  left: innerSize * idx,
                  width: innerSize,
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}>
                <RemoteIcon alt={ele.name} type={ele.name} width={innerSize} height={innerSize} />
              </a>
            ));
          })}
        </div>
      </div>
    </Popup>
  );
}

function filterIcons(data: IconData[], filter?: string) {
  if (!filter || !filter.trim().length) {
    return data;
  }

  return data.filter(
    ele =>
      ele.name.includes(filter) || ele.aliases.some(a => a.includes(filter)) || ele.tags.some(t => t.includes(filter))
  );
}

export default IconSelect;
