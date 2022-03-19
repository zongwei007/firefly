import { query as queryWeather } from 'services/weather';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withUserApi } from 'infrastructure/auth';
import { Exception, UnknownException } from '../../infrastructure/exception';

async function handler(req: NextApiRequest, res: NextApiResponse<IWeather | ErrorResponse>) {
  const { location } = req.query;

  if (!location || Array.isArray(location)) {
    throw new Exception('无效的 location 参数');
  }

  const [province, city, county] = location.split(' ');

  try {
    const resp = await queryWeather(province, city, county);

    res.status(200).json(resp);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

export default withUserApi(handler);
