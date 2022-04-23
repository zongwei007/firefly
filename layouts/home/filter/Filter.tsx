import type { DetailedHTMLProps, FC, FormEventHandler, HTMLAttributes } from 'react';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect, useKey } from 'react-use';
import { useSettings } from 'hooks';

import styles from './style.module.css';

type FilterProps = DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
  value?: string;
  onFilter?: (value: string) => void;
};

const Filter: FC<FilterProps> = ({ value, onFilter, ...props }) => {
  const { data: config } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (config?.search.autoFocus) {
      inputRef.current?.focus();
    }
  }, [config?.search.autoFocus]);

  useKey('Escape', () => {
    inputRef.current?.focus();
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    if (!inputRef.current) {
      return;
    }

    onFilter?.(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        autoComplete="off"
        className={styles.input}
        type="text"
        title="搜索书签"
        placeholder={value ? `搜索结果：${value}` : undefined}
      />
      <label className={styles.label}>{value ? '再次按回车返回首页' : '书签太多？试试搜索你想寻找的书签吧 :)'}</label>
    </form>
  );
};

export default Filter;
