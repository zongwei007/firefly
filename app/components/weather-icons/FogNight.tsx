import React from 'react';
import styles from './WeatherIcons.module.css';

interface FogNightProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function FogNight({ animate = true, className, style, ...props }: FogNightProps) {
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
        <linearGradient id="c" x1="21.92" x2="38.52" y1="18.75" y2="47.52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#86c3db" />
          <stop offset=".45" stopColor="#86c3db" />
          <stop offset="1" stopColor="#5eafcf" />
        </linearGradient>
        <linearGradient id="a" x1="15.5" x2="48.5" y1="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4d7dd" />
          <stop offset=".45" stopColor="#d4d7dd" />
          <stop offset="1" stopColor="#bec1c6" />
        </linearGradient>
        <linearGradient id="d" y1="51" y2="51" xlinkHref="#a" />
        <clipPath id="b">
          <path className={styles['translate-x-slow rotate-fast']} fill="none" d="M0 7.5h64v32H0z" />
        </clipPath>
      </defs>
      <g className={styles['translate-x-slow rotate-fast']} clipPath="url(#b)">
        <g>
          <path
            className={styles['translate-x-slow rotate-fast']}
            fill="url(#c)"
            stroke="#72b9d5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth=".5"
            d="M46.66 36.2a16.66 16.66 0 01-16.78-16.55 16.29 16.29 0 01.55-4.15A16.56 16.56 0 1048.5 36.1c-.61.06-1.22.1-1.84.1z"
          />
        </g>
      </g>
      <path
        className={styles['translate-x-slow rotate-fast']}
        fill="none"
        stroke="url(#a)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M17 44h30"></path>
      <path
        className={styles['translate-x-slow rotate-fast']}
        fill="none"
        stroke="url(#d)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M17 51h30"></path>
    </svg>
  );
}
