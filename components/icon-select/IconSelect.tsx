import type { ChangeEventHandler, DetailedHTMLProps, FC, FocusEvent, InputHTMLAttributes, RefObject } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { PopupProps } from 'reactjs-popup/dist/types';
import { useDebounce, useIsomorphicLayoutEffect } from 'react-use';
import useImmutableSWR from 'swr/immutable';
import Popup from 'reactjs-popup';
import classNames from 'classnames';
import { mdiClose } from '@mdi/js';
import { useVirtual } from 'react-virtual';
import { Icon, RemoteIcon } from 'components';
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

const IconSelect: FC<IconSelectProps> = ({ onBlur, defaultOpen, defaultValue, column = 5, row = 5, ...props }) => {
  const parentRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
  const [filter, setFilter] = useState<string>();
  const [checked, setChecked] = useState(defaultValue);
  const { data: allIcons } = useImmutableSWR<IconData[]>('/assets/icon-meta.json');
  const [data, setData] = useState<IconData[]>(allIcons || []);

  useDebounce(
    () => {
      setData(filterIcons(allIcons || [], filter));
    },
    500,
    [allIcons, filter]
  );

  const virtual = useVirtual({
    size: Math.ceil(data.length / column),
    parentRef,
    estimateSize: useCallback(() => innerSize, []),
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
        <div className={styles.container} style={{ height: virtual.totalSize }}>
          {virtual.virtualItems.map(virtualRow => {
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
                <RemoteIcon type={ele.name} width={innerSize} height={innerSize} />
              </a>
            ));
          })}
        </div>
      </div>
    </Popup>
  );
};

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
