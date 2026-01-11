import React from 'react';
import styles from './WeatherIcons.module.css';

interface HazeNightProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function HazeNight({ animate = true, className, style, ...props }: HazeNightProps) {
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
          <path className={styles['translate-x-slow rotate-fast']} fill="none" d="M0 7.5h64v32H0z" />
        </clipPath>
      </defs>
      <g className={styles['translate-x-slow rotate-fast']} clipPath="url(#b)">
        <path
          className={styles['translate-x-slow rotate-fast']}
          fill="url(#c)"
          stroke="#72b9d5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".5"
          d="M46.66 36.2a16.66 16.66 0 01-16.78-16.55 16.29 16.29 0 01.55-4.15A16.56 16.56 0 1048.5 36.1c-.61.06-1.22.1-1.84.1z"></path>
      </g>
      <g>
        <path
          className={styles['translate-x-slow rotate-fast']}
          fill="none"
          stroke="url(#a)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M17 44h4.5"
        />
        <path
          className={styles['translate-x-slow rotate-fast']}
          fill="none"
          stroke="url(#d)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M28.5 44H39"
        />
        <path
          className={styles['translate-x-slow rotate-fast']}
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
          className={styles['translate-x-slow rotate-fast']}
          fill="none"
          stroke="url(#f)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M17 51h4.5"
        />
        <path
          className={styles['translate-x-slow rotate-fast']}
          fill="none"
          stroke="url(#g)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M28.5 51H39"
        />
        <path
          className={styles['translate-x-slow rotate-fast']}
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
