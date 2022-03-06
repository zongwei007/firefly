import { format, utcToZonedTime } from 'date-fns-tz';

export async function query(province: string, city: string, county?: string): Promise<WeatherResponse> {
  const params = new URLSearchParams();
  params.append('source', 'pc');
  params.append('weather_type', 'observe|forecast_24h');
  params.append('province', province);
  params.append('city', city);

  if (county) {
    params.append('county', county);
  }

  //https://tianqi.qq.com/
  const resp = await fetch(`https://wis.qq.com/weather/common?${params}`);

  const {
    data: { observe, forecast_24h },
    status,
    message,
  } = await resp.json();

  if (status !== 200) {
    throw new Error(message);
  }

  const zonedTime = utcToZonedTime(Date.now(), 'Asia/Shanghai');
  const today = format(zonedTime, 'yyyy-MM-dd');
  const todayWeather = (Object.values(forecast_24h) as any[]).find(ele => ele.time === today);

  return {
    current: {
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
    },
  };
}
