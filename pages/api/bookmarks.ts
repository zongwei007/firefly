import { NextApiRequest, NextApiResponse } from 'next';
import * as bookmarkService from 'services/bookmark';
import { UnknownException } from 'infrastructure/exception';
import { withUserApi } from 'infrastructure/auth';

async function handler(req: NextApiRequest, res: NextApiResponse<IBookmarkCollection | ErrorResponse>) {
  try {
    const config = await bookmarkService.list();

    res.status(200).json(config);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

export default withUserApi(handler);
