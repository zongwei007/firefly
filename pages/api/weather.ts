import { query as queryWeather } from 'services/weather';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withUserApi } from 'infrastructure/auth';
import { UnknownException } from '../../infrastructure/exception';

async function handler(req: NextApiRequest, res: NextApiResponse<WeatherResponse | ErrorResponse>) {
  const { province, city, county } = req.query;

  try {
    const resp = await queryWeather(first(province), first(city), first(county));

    res.status(200).json(resp);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

function first(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default withUserApi(handler);
