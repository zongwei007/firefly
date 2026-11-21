import classNames from 'classnames';
import type { CSSProperties } from 'react';
import styles from './style.module.css';

type RemoteIconProps = {
  /** 图标标识，格式为 `图标集:名称`，例如 `simple-icons:github` */
  type: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
};

function RemoteIcon({ type, className, width = 24, height = 24, alt }: RemoteIconProps) {
  const [set, name] = type.split(':');
  // 缺少图标集或名称时交给接口返回地球图标，避免拼出非法地址
  const icon = set && name ? `/api/icon/${set}/${name}` : '/api/icon/simple-icons/unknown';

  return (
    <span
      role="img"
      aria-label={alt ?? name}
      className={classNames(styles.icon, className)}
      style={{ '--icon': `url(${icon})`, width, height } as CSSProperties}
    />
  );
}

export default RemoteIcon;
