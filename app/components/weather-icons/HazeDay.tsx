import React from 'react';
import styles from './WeatherIcons.module.css';

interface HazeDayProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function HazeDay({ animate = true, className, style, ...props }: HazeDayProps) {
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
        <linearGradient id="a" x1="17.94" x2="26.94" y1="41.73" y2="57.32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4d7dd" />
          <stop offset=".45" stopColor="#d4d7dd" />
          <stop offset="1" stopColor="#bec1c6" />
        </linearGradient>
        <linearGradient id="d" x1="28.81" x2="37.81" y1="35.45" y2="51.04" xlinkHref="#a" />
        <linearGradient id="e" x1="37.06" x2="46.06" y1="30.68" y2="46.27" xlinkHref="#a" />
        <linearGradient id="f" x1="17.94" x2="26.94" y1="48.73" y2="64.32" xlinkHref="#a" />
        <linearGradient id="g" x1="28.81" x2="37.81" y1="42.45" y2="58.04" xlinkHref="#a" />
        <linearGradient id="h" x1="37.06" x2="46.06" y1="37.68" y2="53.27" xlinkHref="#a" />
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
      <g>
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="url(#a)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M17 44h4.5"
        />
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="url(#d)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M28.5 44H39"
        />
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="url(#e)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M42.5 44H47"
        />
      </g>
      <g>
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="url(#f)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M17 51h4.5"
        />
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="url(#g)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M28.5 51H39"
        />
        <path
          className={styles['translate-x-slow rotate-slow']}
          fill="none"
          stroke="url(#h)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M42.5 51H47"
        />
      </g>
    </svg>
  );
}
