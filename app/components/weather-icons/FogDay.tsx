import React from 'react';
import styles from './WeatherIcons.module.css';

interface FogDayProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function FogDay({ animate = true, className, style, ...props }: FogDayProps) {
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
        <linearGradient id="c" x1="26.75" x2="37.25" y1="29.91" y2="48.09" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset=".45" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="a" x1="15.5" x2="48.5" y1="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4d7dd" />
          <stop offset=".45" stopColor="#d4d7dd" />
          <stop offset="1" stopColor="#bec1c6" />
        </linearGradient>
        <linearGradient id="d" y1="51" y2="51" xlinkHref="#a" />
        <clipPath id="b">
          <path className={styles['translate-x-slow rotate-slow']} fill="none" d="M0 7.5h64v32H0z" />
        </clipPath>
      </defs>
      <g className={styles['translate-x-slow rotate-slow']} strokeMiterlimit="10" clipPath="url(#b)">
        <circle
          className={styles['translate-x-slow rotate-slow']}
          cx="32"
          cy="39"
          r="10.5"
          fill="url(#c)"
          stroke="#f8af18"
          strokeWidth=".5"
        />
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="#fbbf24"
          strokeLinecap="round"
          strokeWidth="3"
          d="M32 22.71V16.5m0 45v-6.21m11.52-27.81l4.39-4.39M16.09 54.91l4.39-4.39m0-23l-4.39-4.39m31.82 31.78l-4.39-4.39M15.71 39H9.5m45 0h-6.21"></path>
      </g>
      <path
        className={styles['translate-x-slow rotate-slow']}
        fill="none"
        stroke="url(#a)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M17 44h30"></path>
      <path
        className={styles['translate-x-slow rotate-slow']}
        fill="none"
        stroke="url(#d)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M17 51h30"></path>
    </svg>
  );
}
