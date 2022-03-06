import { query as queryWeather } from 'services/weather';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<WeatherResponse | ErrorResponse>) {
  try {
    const resp = await queryWeather('北京', '北京市', '昌平区');

    res.status(200).json(resp);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
