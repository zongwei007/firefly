import type { FC } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import styles from './style.module.css';
import useSWR from 'swr';

type WeatherProps = {
  className?: string;
};

const Weather: FC<WeatherProps> = ({ className }) => {
  const { data: weather, error } = useSWR(
    `/api/weather?${new URLSearchParams([
      ['province', '北京'],
      ['city', '北京市'],
      ['county', '昌平区'],
    ])}`,
    {
      refreshInterval: 60 * 60 * 1000,
    }
  );

  if (!weather && !error) {
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

function mappingIcon(weather: WeatherResponse['current']) {
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
