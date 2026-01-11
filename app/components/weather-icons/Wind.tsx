import React from 'react';
import styles from './WeatherIcons.module.css';

interface WindProps extends React.SVGProps<SVGSVGElement> {
  /** 是否启用动画 */
  animate?: boolean;
}

export default function Wind({ animate = true, className, style, ...props }: WindProps) {
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
        <linearGradient id="b" x1="19.96" x2="31.37" y1="29.03" y2="48.8" xlinkHref="#a" />
      </defs>
      <path
        className={animate ? styles['wind'] : ''}
        fill="none"
        stroke="url(#a)"
        strokeDasharray="35 22"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M43.64 20a5 5 0 113.61 8.46h-35.5"></path>
      <path
        className={animate ? styles['wind'] : ''}
        fill="none"
        stroke="url(#b)"
        strokeDasharray="24 15"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M29.14 44a5 5 0 103.61-8.46h-21"></path>
    </svg>
  );
}
