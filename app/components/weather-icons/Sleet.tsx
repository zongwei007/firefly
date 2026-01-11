import React from 'react';
import styles from './WeatherIcons.module.css';

interface SleetProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function Sleet({ animate = true, className, style, ...props }: SleetProps) {
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
        <linearGradient id="c" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3f7fe" />
          <stop offset=".45" stopColor="#f3f7fe" />
          <stop offset="1" stopColor="#deeafb" />
        </linearGradient>
        <linearGradient id="a" x1="23.12" x2="24.88" y1="43.48" y2="46.52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#86c3db" />
          <stop offset=".45" stopColor="#86c3db" />
          <stop offset="1" stopColor="#5eafcf" />
        </linearGradient>
        <linearGradient id="d" x1="22.67" x2="25.33" y1="42.69" y2="47.31" xlinkHref="#a" />
        <linearGradient id="e" x1="37.12" x2="38.88" y1="43.48" y2="46.52" xlinkHref="#a" />
        <linearGradient id="f" x1="36.67" x2="39.33" y1="42.69" y2="47.31" xlinkHref="#a" />
        <linearGradient id="b" x1="23.31" x2="24.69" y1="44.3" y2="46.7" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4286ee" />
          <stop offset=".45" stopColor="#4286ee" />
          <stop offset="1" stopColor="#0950bc" />
        </linearGradient>
        <linearGradient id="g" x1="30.31" x2="31.69" y1="44.3" y2="46.7" xlinkHref="#b" />
        <linearGradient id="h" x1="37.31" x2="38.69" y1="44.3" y2="46.7" xlinkHref="#b" />
      </defs>
      <path
        className={animate ? styles['snowflake'] : ''}
        fill="url(#c)"
        stroke="#e6effc"
        strokeMiterlimit="10"
        strokeWidth=".5"
        d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"
      />
      <g>
        <circle
          className={animate ? styles['snowflake'] : ''}
          cx="24"
          cy="45"
          r="1.25"
          fill="none"
          stroke="url(#a)"
          strokeMiterlimit="10"
        />
        <path
          className={animate ? styles['snowflake'] : ''}
          fill="none"
          stroke="url(#d)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          d="M26.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M24 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63"
        />
      </g>
      <g>
        <circle
          className={animate ? styles['snowflake'] : ''}
          cx="38"
          cy="45"
          r="1.25"
          fill="none"
          stroke="url(#e)"
          strokeMiterlimit="10"
        />
        <path
          className={animate ? styles['snowflake'] : ''}
          fill="none"
          stroke="url(#f)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          d="M40.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M38 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63"
        />
      </g>
      <path
        className={animate ? styles['snowflake'] : ''}
        fill="none"
        stroke="url(#b)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M24.08 45.01l-.16.98"></path>
      <path
        className={animate ? styles['snowflake'] : ''}
        fill="none"
        stroke="url(#g)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M31.08 45.01l-.16.98"></path>
      <path
        className={animate ? styles['snowflake'] : ''}
        fill="none"
        stroke="url(#h)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M38.08 45.01l-.16.98"></path>
    </svg>
  );
}
