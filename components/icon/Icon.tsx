import { FC } from 'react';
import styles from './style.module.css';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import classNames from 'classnames';

const Icon: FC<Omit<ImageProps, 'src'> & { type: string }> = ({ className, type, ...rest }) => {
  return (
    <Image
      {...rest}
      className={classNames(className, styles.icon)}
      src={`/assets/mdi/${type}.svg`}
      alt="图标"
      priority
    />
  );
};

export default Icon;
