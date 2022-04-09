import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import styles from './style.module.css';
import classNames from 'classnames';
import { Icon } from 'components';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  icon?: string;
  mode?: 'circle' | 'circle-link';
  size?: 'sm' | 'base';
};

const ICON_SIZE = {
  sm: '16px',
  base: '24px',
};

const Button: FC<ButtonProps> = ({ children, className, icon, mode, size = 'base', type = 'button', ...rest }) => {
  const clsName = classNames(styles.btn, className, {
    [styles.icon]: !!icon,
    [styles.circle]: mode?.startsWith('circle'),
    [styles.link]: mode?.endsWith('link'),
    [styles.iconOnly]: !children,
  });

  return (
    <button {...rest} className={clsName} type={type}>
      {icon ? (
        <div className={styles.container}>
          <Icon path={icon} size={ICON_SIZE[size]} />
        </div>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
