import { useState } from 'react';
import type { FC } from 'react';
import classNames from 'classnames';
import { useInterval } from 'react-use';
import Image from 'next/image';
import styles from './style.module.css';

type WeatherProps = {
  className?: string;
  defaultValue: WeatherResponse;
};

let lastRequestAt = Date.now();

const Weather: FC<WeatherProps> = ({ className, defaultValue }) => {
  const [weather, setWeather] = useState(defaultValue);

  useInterval(() => {
    if (Date.now() - lastRequestAt > 1000 * 60 * 60) {
      fetch('/api/weather')
        .then(resp => resp.json())
        .then(weather => {
          setWeather(weather);
          lastRequestAt = Date.now();
        });
    }
  }, 1000 * 60 * 10);

  return (
    <div className={classNames(className, styles.weather, 'clearfix')}>
      <div className="pull-left">
        <Image src={`/assets/weather/${mappingIcon(weather.current)}.svg`} width={64} height={64} />
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
  return ICON_MAPPING[weather.weatherCode];
}

const ICON_MAPPING: Record<string, string> = {
  '00': 'day',
  '01': 'cloudy',
  '02': 'cloudy-day-1',
  '07': 'rainy-4',
};

export default Weather;
