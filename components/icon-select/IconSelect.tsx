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

const ICON_SET = 'simple-icons';

type IconData = {
  slug: string;
  title: string;
  hex: string;
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
  const { data: allIcons } = useImmutableSWR<IconData[]>('/assets/icons.json', request);
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

    const idx = allIcons.findIndex(ele => toIconType(ele.slug) === defaultValue);
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
            return data.slice(virtualRow.index * column, (virtualRow.index + 1) * column).map((ele, idx) => {
              const type = toIconType(ele.slug);

              return (
                <a
                  key={ele.slug}
                  onClick={() => setChecked(type)}
                  title={ele.title}
                  className={classNames(styles.icon, { [styles.checked]: checked === type })}
                  style={{
                    left: innerSize * idx,
                    width: innerSize,
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}>
                  <RemoteIcon
                    alt={ele.title}
                    type={type}
                    className={styles.preview}
                    width={innerSize}
                    height={innerSize}
                  />
                </a>
              );
            });
          })}
        </div>
      </div>
    </Popup>
  );
}

function toIconType(slug: string) {
  return `${ICON_SET}:${slug}`;
}

function filterIcons(data: IconData[], filter?: string) {
  const keyword = filter?.trim().toLowerCase();

  if (!keyword) {
    return data;
  }

  return data.filter(ele => ele.slug.includes(keyword) || ele.title.toLowerCase().includes(keyword));
}

export default IconSelect;
