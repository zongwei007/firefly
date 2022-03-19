import type { FC } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import styles from './style.module.css';
import { useWeather } from 'hooks';

const Weather: FC<{ className?: string }> = ({ className }) => {
  const { data: weather } = useWeather();

  if (!weather) {
    return null;
  }

  return (
    <div className={classNames(className, styles.weather, 'clearfix')}>
      <div className="pull-left">
        <Image
          src={`/assets/weather/${mappingIcon(weather.current)}.svg`}
          width={64}
          height={64}
          title={weather.current.weather}
        />
      </div>
      <div className={classNames('pull-right', styles.weatherValue)}>
        <p>{weather.current.degree}℃</p>
        <p>
          {weather.today.minDegree} ~ {weather.today.maxDegree}℃
        </p>
      </div>
    </div>
  );
};

function mappingIcon(weather: IWeather['current']) {
  return ICON_MAPPING[weather.weatherCode] || 'day';
}

const ICON_MAPPING: Record<string, string> = {
  '00': 'day',
  '01': 'cloudy',
  '02': 'cloudy-day-2',
  '07': 'rainy-4',
  '53': 'cloudy-day-1',
};

export default Weather;
