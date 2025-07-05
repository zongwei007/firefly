'use server';

import { format, toZonedTime } from 'date-fns-tz';

interface WeatherData {
  status: number;
  message: string;
  data: {
    observe: {
      degree: string;
      precipitation: string;
      pressure: string;
      weather: string;
      weather_code: string;
      weather_short: string;
      wind_direction: string;
      wind_power: string;
    };
    forecast_24h: Array<{
      time: string;
      max_degree: string;
      min_degree: string;
    }>;
    rise: Array<{
      time: string;
      sunrise: string;
      sunset: string;
    }>;
    air: {
      aqi: number;
      aqi_level: number;
      aqi_name: string;
    };
  };
}

export async function fromSetting(weather: ISetting['weather']) {
  if (!weather.enable) {
    return null;
  }

  return fromLocation(weather.location);
}

export async function fromLocation(location: string) {
  const [province, city, county] = location.split(' ');

  return query(province, city, county);
}

async function query(province: string, city: string, county?: string): Promise<IWeather> {
  const params = new URLSearchParams();
  params.append('source', 'pc');
  params.append('weather_type', 'observe|forecast_24h|rise|air');
  params.append('province', province);

  if (city) {
    params.append('city', city);
  }
  if (county) {
    params.append('county', county);
  }

  //https://tianqi.qq.com/
  const resp = await fetch(`https://wis.qq.com/weather/common?${params}`);
  const data: WeatherData = await resp.json();

  if (!resp.ok || data.status !== 200) {
    throw new Error(data.message);
  }

  const {
    data: { observe, forecast_24h, rise, air },
  } = data;

  if (!observe.degree) {
    throw new Error(`无法获取 ${province}${city || ''}${county || ''} 的天气数据`);
  }

  const zonedTime = toZonedTime(Date.now(), 'Asia/Shanghai');
  const todayWeather = Object.values(forecast_24h).find(ele => ele.time === format(zonedTime, 'yyyy-MM-dd'))!;
  const todayRise = Object.values(rise).find(ele => ele.time === format(zonedTime, 'yyyyMMdd'))!;

  return {
    current: {
      aqi: air.aqi,
      aqiLevel: air.aqi_level,
      aqiName: air.aqi_name,
      degree: parseInt(observe.degree),
      precipitation: parseInt(observe.precipitation),
      pressure: parseInt(observe.pressure),
      weather: observe.weather,
      weatherCode: observe.weather_code,
      weatherShort: observe.weather_short,
      windDirection: parseInt(observe.wind_direction),
      windPower: parseInt(observe.wind_power),
    },
    today: {
      maxDegree: parseInt(todayWeather?.max_degree),
      minDegree: parseInt(todayWeather?.min_degree),
      sunrise: todayRise.sunrise,
      sunset: todayRise.sunset,
    },
  };
}
