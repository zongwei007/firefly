import type { FC } from 'react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import classNames from 'classnames';
import styles from './style.module.css';

type IconProps = Omit<ImageProps, 'src'> & { type: string };

const RemoteIcon: FC<IconProps> = ({ className, type, ...rest }) => {
  return (
    <Image {...rest} className={classNames(className, styles.icon)} src={`/assets/${type}.svg`} alt="图标" priority />
  );
};

export default RemoteIcon;
