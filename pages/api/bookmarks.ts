import { NextApiRequest, NextApiResponse } from 'next';
import * as bookmarkService from 'services/bookmark';
import { UnknownException, UnsupportedMethodException } from 'infrastructure/exception';
import { withUserApi } from 'infrastructure/auth';

async function handleRead(req: NextApiRequest, res: NextApiResponse<IBookmarkConfiguration | ErrorResponse>) {
  try {
    const config = await bookmarkService.list();

    res.status(200).json(config);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

async function handleWrite(req: NextApiRequest, res: NextApiResponse<IBookmarkConfiguration | ErrorResponse>) {
  try {
    const data: IBookmarkConfiguration = JSON.parse(req.body);
    const result = await bookmarkService.set(data);

    res.status(200).json(result);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<IBookmarkConfiguration | ErrorResponse>) {
  switch (req.method) {
    case 'GET':
      return handleRead(req, res);
    case 'PUT':
      return handleWrite(req, res);
    default:
      throw new UnsupportedMethodException(req.method);
  }
}

export default withUserApi(handler);
