import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import styles from './style.module.css';
import classNames from 'classnames';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button className={classNames(styles.btn, className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
