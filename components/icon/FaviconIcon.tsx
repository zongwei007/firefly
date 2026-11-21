import { RemoteIcon } from '@/components';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

type FaviconIconProps = Omit<ImageProps, 'src'> & { icon?: string; link: string };

function FaviconIcon({ icon, link, ...rest }: FaviconIconProps) {
  if (icon) {
    return <RemoteIcon type={icon} {...rest} />;
  }

  return (
    <Image
      src={`/api/favicon?host=${encodeURIComponent(getOrigin(link))}`}
      {...rest}
      alt={`${link} 的图标`}
      unoptimized
    />
  );
}

function getOrigin(link: string) {
  try {
    return new URL(link).origin;
  } catch {
    return link;
  }
}

export default FaviconIcon;
