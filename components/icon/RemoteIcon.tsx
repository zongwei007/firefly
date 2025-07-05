import classNames from 'classnames';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import styles from './style.module.css';

type IconProps = Omit<ImageProps, 'src'> & { type: string };

function RemoteIcon({ className, type, ...rest }: IconProps) {
  return (
    <Image
      {...rest}
      className={classNames(className, styles.icon)}
      src={`/assets/${type}.svg`}
      alt="图标"
      priority={false}
    />
  );
}

export default RemoteIcon;
