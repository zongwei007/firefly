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
  sm: 16,
  base: 24,
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
          <Icon type={icon} width={ICON_SIZE[size]} height={ICON_SIZE[size]} layout="fixed" />
        </div>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
