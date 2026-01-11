import React from 'react';
import styles from './WeatherIcons.module.css';

interface HailProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function Hail({ animate = true, className, style, ...props }: HailProps) {
  const animationClass = animate ? styles['weather-icon-animated'] : '';
  const combinedClassName = `${animationClass} ${className || ''}`.trim();

  return (
    <svg
      className={combinedClassName}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      {...props}>
      <defs>
        <linearGradient id="b" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3f7fe" />
          <stop offset=".45" stopColor="#f3f7fe" />
          <stop offset="1" stopColor="#deeafb" />
        </linearGradient>
        <linearGradient id="a" x1="23.25" x2="24.75" y1="43.7" y2="46.3" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#86c3db" />
          <stop offset=".45" stopColor="#86c3db" />
          <stop offset="1" stopColor="#5eafcf" />
        </linearGradient>
        <linearGradient id="c" x1="30.25" x2="31.75" y1="43.7" y2="46.3" xlinkHref="#a" />
        <linearGradient id="d" x1="37.25" x2="38.75" y1="43.7" y2="46.3" xlinkHref="#a" />
      </defs>
      <path
        className={animate ? styles['hail'] : ''}
        fill="url(#b)"
        stroke="#e6effc"
        strokeMiterlimit="10"
        strokeWidth=".5"
        d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"
      />
      <path
        className={animate ? styles['hail'] : ''}
        fill="url(#a)"
        d="M24 43.5a1.5 1.5 0 101.5 1.5 1.5 1.5 0 00-1.5-1.5z"></path>
      <path
        className={animate ? styles['hail'] : ''}
        fill="url(#c)"
        d="M31 43.5a1.5 1.5 0 101.5 1.5 1.5 1.5 0 00-1.5-1.5z"></path>
      <path
        className={animate ? styles['hail'] : ''}
        fill="url(#d)"
        d="M38 43.5a1.5 1.5 0 101.5 1.5 1.5 1.5 0 00-1.5-1.5z"></path>
    </svg>
  );
}
