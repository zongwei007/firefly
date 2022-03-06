import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';

import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import styles from './style.module.css';

type FilterProps = DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement>;

const Filter: FC<FilterProps> = props => {
  const inputRef = useRef<HTMLInputElement>(null);

  useIsomorphicLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form {...props}>
      <input ref={inputRef} autoComplete="off" name="search" className={styles.input} type="text" title="搜索书签" />
      <label htmlFor="search" className={styles.label}>
        书签太多？试试搜索你想寻找的书签吧 :)
      </label>
    </form>
  );
};

export default Filter;
