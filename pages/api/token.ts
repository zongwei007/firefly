import type { NextApiRequest, NextApiResponse } from 'next';
import { build as buildToken, getTokenConfig, updateToken } from 'infrastructure/auth';
import { Exception, ForbiddenException, withExceptionWrapper } from 'infrastructure/exception';

async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse>) {
  switch (req.method) {
    case 'POST':
      await handleLogin(req, res);
      break;
    case 'DELETE':
      await handleLogout(req, res);
      break;
  }
}

async function handleLogin(req: NextApiRequest, res: NextApiResponse<ErrorResponse>) {
  const cfg = getTokenConfig();
  const body = req.body;

  if (cfg.disabled) {
    throw new ForbiddenException('已禁用登录功能');
  }

  if (body.username !== cfg.username || body.password !== cfg.password) {
    throw new Exception('用户名或密码错误');
  }

  const { token, expires } = buildToken(body.username);

  updateToken(res, token, expires);
  res.status(204);
  res.end();
}

async function handleLogout(req: NextApiRequest, res: NextApiResponse) {
  updateToken(res, 'null', new Date());
  res.status(204);
  res.end();
}

export default withExceptionWrapper(handler);
