import { type ChangeEventHandler, type CSSProperties, type FC, type MouseEventHandler, useRef } from 'react';
import classNames from 'classnames';
import { Icon } from 'components';
import { mdiCheckboxBlankOutline, mdiCheckboxOutline } from '@mdi/js';
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

const Checkbox: FC<CheckboxProps> = ({ className, checked, onClick, onChange, size = 'base', ...props }) => {
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
};

export default Checkbox;
