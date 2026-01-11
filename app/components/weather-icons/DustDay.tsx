import React from 'react';
import styles from './WeatherIcons.module.css';

interface DustDayProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function DustDay({ animate = true, className, style, ...props }: DustDayProps) {
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
        <linearGradient id="c" x1="26.75" x2="37.25" y1="22.91" y2="41.09" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset=".45" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="a" x1="22.14" x2="27.53" y1="36" y2="45.32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset=".45" stopColor="#fde68a" />
          <stop offset="1" stopColor="#fde171" />
        </linearGradient>
        <linearGradient id="d" x1="34.27" x2="39.66" y1="28.99" y2="38.32" xlinkHref="#a" />
        <linearGradient id="e" x1="43.47" x2="48.86" y1="23.68" y2="33" xlinkHref="#a" />
        <linearGradient id="f" x1="32.14" x2="37.53" y1="36" y2="45.32" xlinkHref="#a" />
        <linearGradient id="g" x1="44.27" x2="49.66" y1="28.99" y2="38.32" xlinkHref="#a" />
        <linearGradient id="h" x1="53.47" x2="58.86" y1="23.68" y2="33" xlinkHref="#a" />
        <clipPath id="b">
          <path className={styles['dust rotate-slow']} fill="none" d="M7.5 7.5h47l-47 47v-47z" />
        </clipPath>
      </defs>
      <g className={styles['dust rotate-slow']} strokeMiterlimit="10" clipPath="url(#b)">
        <circle
          className={styles['dust rotate-slow']}
          cx="32"
          cy="32"
          r="10.5"
          fill="url(#c)"
          stroke="#f8af18"
          strokeWidth=".5"
        />
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="#fbbf24"
          strokeLinecap="round"
          strokeWidth="3"
          d="M32 15.71V9.5m0 45v-6.21m11.52-27.81l4.39-4.39M16.09 47.91l4.39-4.39m0-23l-4.39-4.39m31.82 31.78l-4.39-4.39M15.71 32H9.5m45 0h-6.21"></path>
      </g>
      <g>
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="url(#a)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M24.89 45.11l3.19-3.19"
        />
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="url(#d)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M33.03 36.97l7.42-7.42"
        />
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="url(#e)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M42.92 27.08l3.19-3.19"
        />
      </g>
      <g>
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="url(#f)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M34.89 45.11l3.19-3.19"
        />
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="url(#g)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M43.03 36.97l7.42-7.42"
        />
        <path
          className={styles['dust rotate-slow']}
          fill="none"
          stroke="url(#h)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M52.92 27.08l3.19-3.19"
        />
      </g>
    </svg>
  );
}
