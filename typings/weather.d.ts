declare type IWeather = {
  current: {
    //空气质量指数
    aqi: number;
    //空气质量等级
    aqiLevel: number;
    //空气质量名称
    aqiName: string;
    //气温
    degree: number;
    //降水概率
    precipitation: number;
    //气压
    pressure: number;
    //天气名称
    weather: string;
    //天气代码
    weatherCode: string;
    //天气
    weatherShort: string;
    //风向
    windDirection: number;
    //风力
    windPower: number;
  };
  today: {
    //最高气温
    maxDegree: number;
    //最低气温
    minDegree: number;
    //日出时间
    sunrise: string;
    //日落时间
    sunset: string;
  };
};
