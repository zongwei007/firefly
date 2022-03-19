import { NextApiRequest, NextApiResponse } from 'next';
import * as settingService from 'services/setting';
import { UnknownException, UnsupportedMethodException } from 'infrastructure/exception';
import { withUserApi } from 'infrastructure/auth';

async function handleRead(req: NextApiRequest, res: NextApiResponse<ISetting | ErrorResponse>) {
  try {
    const config = await settingService.get();

    res.status(200).json(config);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

async function handleWrite(req: NextApiRequest, res: NextApiResponse<ISetting | ErrorResponse>) {
  try {
    const data: ISetting = JSON.parse(req.body);
    const value = { ...data, lastModifiedAt: new Date().toISOString() };

    await settingService.set(value);

    res.status(200).json(value);
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<ISetting | ErrorResponse>) {
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
