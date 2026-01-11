import React from 'react';
import styles from './WeatherIcons.module.css';

interface DustWindProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function DustWind({ animate = true, className, style, ...props }: DustWindProps) {
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
        <linearGradient id="a" x1="27.56" x2="38.27" y1="17.64" y2="36.19" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4d7dd" />
          <stop offset=".45" stopColor="#d4d7dd" />
          <stop offset="1" stopColor="#bec1c6" />
        </linearGradient>
        <linearGradient id="c" x1="19.96" x2="31.37" y1="29.03" y2="48.8" xlinkHref="#a" />
        <linearGradient id="b" x1="24.13" x2="27.87" y1="36.25" y2="42.75" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset=".45" stopColor="#fde68a" />
          <stop offset="1" stopColor="#fde171" />
        </linearGradient>
        <linearGradient id="d" x1="14.13" x2="17.87" y1="21.25" y2="27.75" xlinkHref="#b" />
        <linearGradient id="e" x1="30.13" x2="33.87" y1="28.75" y2="35.25" xlinkHref="#b" />
      </defs>
      <path
        className={styles['wind dust']}
        fill="none"
        stroke="url(#a)"
        strokeDasharray="35 22"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M43.64 20a5 5 0 113.61 8.46h-35.5"></path>
      <path
        className={styles['wind dust']}
        fill="none"
        stroke="url(#c)"
        strokeDasharray="24 15"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M29.14 44a5 5 0 103.61-8.46h-21"></path>
      <g>
        <path
          className={styles['wind dust']}
          fill="none"
          stroke="url(#b)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M21.5 39.5h9"
        />
      </g>
      <g>
        <path
          className={styles['wind dust']}
          fill="none"
          stroke="url(#d)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M11.5 24.5h9"
        />
      </g>
      <g>
        <path
          className={styles['wind dust']}
          fill="none"
          stroke="url(#e)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M27.5 32h9"
        />
      </g>
    </svg>
  );
}
