import { FC } from 'react';
import { Icon } from 'components';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

const FaviconIcon: FC<Omit<ImageProps, 'src'> & { icon?: string; link: string }> = ({ icon, link, ...rest }) => {
  return icon ? (
    <Icon type={icon} {...rest} />
  ) : (
    <Image src={`/api/favicon?host=${encodeURI(new URL(link).origin)}`} {...rest} />
  );
};

export default FaviconIcon;
