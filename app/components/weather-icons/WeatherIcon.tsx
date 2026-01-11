'use client';

import React from 'react';
import * as Icons from './index';

// 图标名称到组件的映射
const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { animate?: boolean }>> = {
  'clear-day': Icons.ClearDay,
  'clear-night': Icons.ClearNight,
  'cloudy': Icons.Cloudy,
  'drizzle': Icons.Drizzle,
  'dust-day': Icons.DustDay,
  'dust-night': Icons.DustNight,
  'dust-wind': Icons.DustWind,
  'fog-day': Icons.FogDay,
  'fog-night': Icons.FogNight,
  'hail': Icons.Hail,
  'haze-day': Icons.HazeDay,
  'haze-night': Icons.HazeNight,
  'mist': Icons.Mist,
  'overcast-day': Icons.OvercastDay,
  'overcast-night': Icons.OvercastNight,
  'partly-cloudy-day': Icons.PartlyCloudyDay,
  'partly-cloudy-day-rain': Icons.PartlyCloudyDayRain,
  'partly-cloudy-day-snow': Icons.PartlyCloudyDaySnow,
  'partly-cloudy-night': Icons.PartlyCloudyNight,
  'partly-cloudy-night-rain': Icons.PartlyCloudyNightRain,
  'partly-cloudy-night-snow': Icons.PartlyCloudyNightSnow,
  'rain': Icons.Rain,
  'sleet': Icons.Sleet,
  'snow': Icons.Snow,
  'thunderstorms-day': Icons.ThunderstormsDay,
  'thunderstorms-day-rain': Icons.ThunderstormsDayRain,
  'thunderstorms-night': Icons.ThunderstormsNight,
  'thunderstorms-night-rain': Icons.ThunderstormsNightRain,
  'wind': Icons.Wind,
};

export type WeatherIconName = keyof typeof iconMap;

interface WeatherIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  /** 图标名称 */
  iconName: WeatherIconName;
  /** 是否启用动画，默认为true */
  animate?: boolean;
  /** 图标尺寸，默认为64 */
  size?: number;
  /** 替代文本 */
  alt?: string;
}

/**
 * 天气图标组件
 * 替代原有的Image组件，使用CSS动画优化性能
 */
export default function WeatherIcon({
  iconName,
  animate = true,
  size = 64,
  className,
  style,
  alt,
  ...props
}: WeatherIconProps) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`WeatherIcon: 未找到图标 "${iconName}"`);
    return null;
  }

  const combinedStyle = {
    width: size,
    height: size,
    ...style,
  };

  return (
    <IconComponent
      animate={animate}
      className={className}
      style={combinedStyle}
      aria-label={alt}
      {...props}
    />
  );
}

// 导出图标名称类型和映射
export { iconMap };
export type { WeatherIconProps };
