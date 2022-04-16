import { format, utcToZonedTime } from 'date-fns-tz';
import { Exception } from 'infrastructure/exception';

export async function query(province: string, city: string, county?: string): Promise<IWeather> {
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

  const {
    data: { observe, forecast_24h, rise, air },
    status,
    message,
  } = await resp.json();

  if (status !== 200) {
    throw new Error(message);
  }

  if (!observe.degree) {
    throw new Exception(`无法获取 ${province}${city || ''}${county || ''} 的天气数据`);
  }

  const zonedTime = utcToZonedTime(Date.now(), 'Asia/Shanghai');
  const today = format(zonedTime, 'yyyy-MM-dd');
  const todayShort = format(zonedTime, 'yyyyMMdd');
  const todayWeather = (Object.values(forecast_24h) as any[]).find(ele => ele.time === today);
  const todayRise = (Object.values(rise) as any[]).find(ele => ele.time === todayShort);

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
