import React from 'react';
import styles from './WeatherIcons.module.css';

interface DustNightProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function DustNight({ animate = true, className, style, ...props }: DustNightProps) {
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
          <path className={styles['dust rotate-fast']} fill="none" d="M7.5 7.5h47l-47 47v-47z" />
        </clipPath>
      </defs>
      <g className={styles['dust rotate-fast']} clipPath="url(#b)">
        <g>
          <path
            className={styles['dust rotate-fast']}
            fill="url(#c)"
            stroke="#72b9d5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth=".5"
            d="M46.66 36.2a16.66 16.66 0 01-16.78-16.55 16.29 16.29 0 01.55-4.15A16.56 16.56 0 1048.5 36.1c-.61.06-1.22.1-1.84.1z"
          />
        </g>
      </g>
      <g>
        <path
          className={styles['dust rotate-fast']}
          fill="none"
          stroke="url(#a)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M24.89 45.11l3.19-3.19"
        />
        <path
          className={styles['dust rotate-fast']}
          fill="none"
          stroke="url(#d)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M33.03 36.97l7.42-7.42"
        />
        <path
          className={styles['dust rotate-fast']}
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
          className={styles['dust rotate-fast']}
          fill="none"
          stroke="url(#f)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M34.89 45.11l3.19-3.19"
        />
        <path
          className={styles['dust rotate-fast']}
          fill="none"
          stroke="url(#g)"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
          d="M43.03 36.97l7.42-7.42"
        />
        <path
          className={styles['dust rotate-fast']}
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
