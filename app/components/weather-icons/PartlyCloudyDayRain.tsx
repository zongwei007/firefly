import React from 'react';
import styles from './WeatherIcons.module.css';

interface PartlyCloudyDayRainProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function PartlyCloudyDayRain({ animate = true, className, style, ...props }: PartlyCloudyDayRainProps) {
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
        <linearGradient id="a" x1="22.53" x2="25.47" y1="42.95" y2="48.05" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4286ee" />
          <stop offset=".45" stopColor="#4286ee" />
          <stop offset="1" stopColor="#0950bc" />
        </linearGradient>
        <linearGradient id="d" x1="29.53" x2="32.47" y1="42.95" y2="48.05" xlinkHref="#a" />
        <linearGradient id="e" x1="36.53" x2="39.47" y1="42.95" y2="48.05" xlinkHref="#a" />
      </defs>
      <circle cx="19" cy="24" r="5" fill="url(#b)" stroke="#f8af18" strokeMiterlimit="10" strokeWidth=".5" />
      <path
        fill="none"
        stroke="#fbbf24"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M19 15.67V12.5m0 23v-3.17m5.89-14.22l2.24-2.24M10.87 32.13l2.24-2.24m0-11.78l-2.24-2.24m16.26 16.26l-2.24-2.24M7.5 24h3.17m19.83 0h-3.17"></path>
      <path
        fill="url(#c)"
        stroke="#e6effc"
        strokeMiterlimit="10"
        strokeWidth=".5"
        d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"
      />
      <path
        fill="none"
        stroke="url(#a)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M24.39 43.03l-.78 4.94"></path>
      <path
        fill="none"
        stroke="url(#d)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M31.39 43.03l-.78 4.94"></path>
      <path
        fill="none"
        stroke="url(#e)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M38.39 43.03l-.78 4.94"></path>
    </svg>
  );
}
