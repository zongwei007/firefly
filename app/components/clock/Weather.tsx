'use client';

import { useWeather, useTime } from '@/hooks';
import classNames from 'classnames';
import { format } from 'date-fns';
import Image from 'next/image';
import styles from './style.module.css';

/**
 * 天气组件
 * @param className 样式类名
 *
 * <p>图标来源：https://github.com/basmilius/weather-icons</p>
 */
function Weather({ className }: { className?: string }) {
  const { data: weather } = useWeather();
  const now = useTime()

  if (!weather) {
    return null;
  }

  const time = format(now, 'HH:mm');

  return (
    <div className={classNames(className, 'clearfix')}>
      <div className="pull-left">
        <Image
          alt={weather.current.weather}
          src={`/assets/weather/${mappingIcon(weather.current, time > weather.today.sunrise && time < weather.today.sunset)}.svg`}
          width={64}
          height={64}
        />
      </div>
      <div className="pull-right">
        <p className={styles.mainTemperature}>{weather.current.degree}°</p>
        <p>
          <span title={`气压：${weather.current.pressure}hPa\n降水概率：${weather.current.precipitation}%`}>
            {weather.current.weather}
          </span>
          <span
            className={styles.aqi}
            style={{ background: `var(--weather-aqi-level${weather.current.aqiLevel})` }}
            title={`空气质量指数：${weather.current.aqi}`}>
            {weather.current.aqiName}
          </span>
        </p>
        <p>
          {weather.today.minDegree}° / {weather.today.maxDegree}°
        </p>
      </div>
    </div>
  );
}

/**
 * 获取匹配图标
 * @param weather 天气信息
 * @param isDay 是否白天
 */
function mappingIcon(weather: IWeather['current'], isDay: boolean) {
  const name = ICON_MAPPING[weather.weatherCode] || 'clear-day';

  return isDay ? name : name.replace('day', 'night');
}

const ICON_MAPPING: Record<string, string> = {
  '00': 'clear-day',
  '01': 'partly-cloudy-day',
  '02': 'overcast-day',
  '03': 'partly-cloudy-day-rain',
  '04': 'thunderstorms-day',
  '05': 'thunderstorms-rain-day',
  '06': 'sleet',
  '07': 'drizzle',
  '08': 'drizzle',
  '09': 'hail',
  '10': 'hail',
  '11': 'rain',
  '12': 'rain',
  '13': 'partly-cloudy-day-snow',
  '14': 'snow',
  '15': 'snow',
  '16': 'snow',
  '17': 'snow',
  '18': 'mist',
  '19': 'drizzle',
  '20': 'wind',
  '21': 'drizzle',
  '22': 'hail',
  '23': 'hail',
  '24': 'rain',
  '25': 'rain',
  '26': 'snow',
  '27': 'snow',
  '28': 'snow',
  '29': 'dust-day',
  '30': 'dust-day',
  '31': 'dust-wind',
  '32': 'fog-day',
  '49': 'fog-day',
  '53': 'haze-day',
  '54': 'haze-day',
  '55': 'haze-day',
  '56': 'haze-day',
  '57': 'fog-day',
  '58': 'fog-day',
  '301': 'rain',
  '302': 'snow',
};

export default Weather;
