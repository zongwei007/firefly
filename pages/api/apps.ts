import { NextApiRequest, NextApiResponse } from 'next';
import * as appService from 'services/app';
import { UnknownException } from 'infrastructure/exception';
import { withUserApi } from 'infrastructure/auth';

async function handler(req: NextApiRequest, res: NextApiResponse<AppCollectionData | ErrorResponse>) {
  try {
    const config = await appService.list();

    res.status(200).json(config);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

export default withUserApi(handler);
