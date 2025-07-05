'use client';

import { mdiCheckboxBlankOutline, mdiCheckboxOutline } from '@mdi/js';
import { Icon } from '@mdi/react';
import classNames from 'classnames';
import { type ChangeEventHandler, type CSSProperties, type MouseEventHandler, useRef } from 'react';
import styles from './styles.module.css';

type CheckboxProps = {
  checked?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  size?: 'sm' | 'base';
  style?: CSSProperties;
};

const SIZE_MAPPING = {
  base: 1.2,
  sm: 1,
};

function Checkbox({ className, checked, onClick, onChange, size = 'base', ...props }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <span onClick={handleClick}>
      <Icon
        {...props}
        className={classNames(styles.icon, className)}
        path={checked ? mdiCheckboxOutline : mdiCheckboxBlankOutline}
        size={SIZE_MAPPING[size]}
      />
      <input className={styles.input} onClick={onClick} onChange={onChange} ref={inputRef} type="checkbox" />
    </span>
  );
}

export default Checkbox;
