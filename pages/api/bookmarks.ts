import { NextApiRequest, NextApiResponse } from 'next';
import * as bookmarkService from 'services/bookmark';
import { ForbiddenException, UnsupportedMethodException, withExceptionWrapper } from 'infrastructure/exception';
import { withUserApi } from 'infrastructure/auth';
import getConfiguration from 'infrastructure/configuration';

async function handleRead(
  req: NextApiRequest,
  res: NextApiResponse<IBookmarkConfiguration | ErrorResponse>,
  { user }: AuthenticationContext<false>
) {
  const anonymous = req.query.anonymous === 'true' && !user;
  const config = await bookmarkService.list(anonymous);

  res.status(200).json(config);
}

async function handleWrite(
  req: NextApiRequest,
  res: NextApiResponse<IBookmarkConfiguration | ErrorResponse>,
  { user }: AuthenticationContext<false>
) {
  if (!user && !getConfiguration().firefly.disableLogin) {
    throw new ForbiddenException();
  }

  const data: IBookmarkConfiguration = JSON.parse(req.body);
  const result = await bookmarkService.set(data);

  res.status(200).json(result);
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IBookmarkConfiguration | ErrorResponse>,
  context: AuthenticationContext<false>
) {
  switch (req.method) {
    case 'GET':
      return handleRead(req, res, context);
    case 'PUT':
      return handleWrite(req, res, context);
    default:
      throw new UnsupportedMethodException(req.method);
  }
}

export default withExceptionWrapper(withUserApi(handler));
