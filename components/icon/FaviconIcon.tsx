import { FC } from 'react';
import { RemoteIcon } from 'components';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

const FaviconIcon: FC<Omit<ImageProps, 'src'> & { icon?: string; link: string }> = ({ icon, link, ...rest }) => {
  return icon ? (
    <RemoteIcon type={icon} {...rest} />
  ) : (
    <Image src={`/api/favicon?host=${encodeURI(new URL(link).origin)}`} {...rest} alt={`${link} 的图标`} unoptimized />
  );
};

export default FaviconIcon;
