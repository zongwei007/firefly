import React from 'react';
import styles from './WeatherIcons.module.css';

interface OvercastNightProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function OvercastNight({ animate = true, className, style, ...props }: OvercastNightProps) {
  const animationClass = animate ? styles['weather-icon-animated'] : '';
  const combinedClassName = `${animationClass} ${className || ''}`.trim();

  return (
    <svg className={combinedClassName} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
      <defs>
        <linearGradient id="a" x1="13.58" x2="24.15" y1="15.57" y2="33.87" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#86c3db" />
          <stop offset=".45" stopColor="#86c3db" />
          <stop offset="1" stopColor="#5eafcf" />
        </linearGradient>
        <linearGradient id="b" x1="40.76" x2="50.83" y1="23" y2="40.46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9ca3af" />
          <stop offset=".45" stopColor="#9ca3af" />
          <stop offset="1" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="c" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3f7fe" />
          <stop offset=".45" stopColor="#f3f7fe" />
          <stop offset="1" stopColor="#deeafb" />
        </linearGradient>
      </defs>
      <path
        className={styles['translate-x-slow rotate-fast']}
        fill="url(#a)"
        stroke="#72b9d5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".5"
        d="M29.33 26.68a10.61 10.61 0 01-10.68-10.54A10.5 10.5 0 0119 13.5a10.54 10.54 0 1011.5 13.11 11.48 11.48 0 01-1.17.07z"></path>
      <path
        className={styles['translate-x-slow rotate-fast']}
        fill="url(#b)"
        stroke="#848b98"
        strokeMiterlimit="10"
        strokeWidth=".5"
        d="M34.23 33.45a4.05 4.05 0 004.05 4h16.51a4.34 4.34 0 00.81-8.61 3.52 3.52 0 00.06-.66 4.06 4.06 0 00-6.13-3.48 6.08 6.08 0 00-11.25 3.19 6.34 6.34 0 00.18 1.46h-.18a4.05 4.05 0 00-4.05 4.1z"></path>
      <path
        className={styles['translate-x-slow rotate-fast']}
        fill="url(#c)"
        stroke="#e6effc"
        strokeMiterlimit="10"
        strokeWidth=".5"
        d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"></path>
    </svg>
  );
}
