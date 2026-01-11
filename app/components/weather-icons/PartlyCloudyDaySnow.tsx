import React from 'react';
import styles from './WeatherIcons.module.css';

interface PartlyCloudyDaySnowProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function PartlyCloudyDaySnow({ animate = true, className, style, ...props }: PartlyCloudyDaySnowProps) {
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
        <linearGradient id="b" x1="16.5" x2="21.5" y1="19.67" y2="28.33" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset=".45" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="c" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3f7fe" />
          <stop offset=".45" stopColor="#f3f7fe" />
          <stop offset="1" stopColor="#deeafb" />
        </linearGradient>
        <linearGradient id="a" x1="30.12" x2="31.88" y1="43.48" y2="46.52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#86c3db" />
          <stop offset=".45" stopColor="#86c3db" />
          <stop offset="1" stopColor="#5eafcf" />
        </linearGradient>
        <linearGradient id="d" x1="29.67" x2="32.33" y1="42.69" y2="47.31" xlinkHref="#a" />
        <linearGradient id="e" x1="23.12" x2="24.88" y1="43.48" y2="46.52" xlinkHref="#a" />
        <linearGradient id="f" x1="22.67" x2="25.33" y1="42.69" y2="47.31" xlinkHref="#a" />
        <linearGradient id="g" x1="37.12" x2="38.88" y1="43.48" y2="46.52" xlinkHref="#a" />
        <linearGradient id="h" x1="36.67" x2="39.33" y1="42.69" y2="47.31" xlinkHref="#a" />
      </defs>
      <circle
        className={styles['snowflake rotate-slow']}
        cx="19"
        cy="24"
        r="5"
        fill="url(#b)"
        stroke="#f8af18"
        strokeMiterlimit="10"
        strokeWidth=".5"
      />
      <path
        className={styles['snowflake rotate-slow']}
        fill="none"
        stroke="#fbbf24"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M19 15.67V12.5m0 23v-3.17m5.89-14.22l2.24-2.24M10.87 32.13l2.24-2.24m0-11.78l-2.24-2.24m16.26 16.26l-2.24-2.24M7.5 24h3.17m19.83 0h-3.17"></path>
      <path
        className={styles['snowflake rotate-slow']}
        fill="url(#c)"
        stroke="#e6effc"
        strokeMiterlimit="10"
        strokeWidth=".5"
        d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"
      />
      <g>
        <circle
          className={styles['snowflake rotate-slow']}
          cx="31"
          cy="45"
          r="1.25"
          fill="none"
          stroke="url(#a)"
          strokeMiterlimit="10"
        />
        <path
          className={styles['snowflake rotate-slow']}
          fill="none"
          stroke="url(#d)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          d="M33.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M31 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63"
        />
      </g>
      <g>
        <circle
          className={styles['snowflake rotate-slow']}
          cx="24"
          cy="45"
          r="1.25"
          fill="none"
          stroke="url(#e)"
          strokeMiterlimit="10"
        />
        <path
          className={styles['snowflake rotate-slow']}
          fill="none"
          stroke="url(#f)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          d="M26.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M24 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63"
        />
      </g>
      <g>
        <circle
          className={styles['snowflake rotate-slow']}
          cx="38"
          cy="45"
          r="1.25"
          fill="none"
          stroke="url(#g)"
          strokeMiterlimit="10"
        />
        <path
          className={styles['snowflake rotate-slow']}
          fill="none"
          stroke="url(#h)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          d="M40.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M38 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63"
        />
      </g>
    </svg>
  );
}
