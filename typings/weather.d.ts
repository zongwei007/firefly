declare type IWeather = {
  current: {
    degree: number;
    precipitation: number;
    pressure: number;
    weather: string;
    weatherCode: string;
    weatherShort: string;
    windDirection: number;
    windPower: number;
  };
  today: {
    maxDegree: number;
    minDegree: number;
    sunrise: string;
    sunset: string;
  };
};
