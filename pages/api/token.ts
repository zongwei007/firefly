import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'infrastructure/cookie';
import { build as buildToken, getTokenConfig } from 'infrastructure/auth';
import { Exception, ForbiddenException, UnknownException } from 'infrastructure/exception';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse>) {
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

  try {
    const { token, expires } = buildToken(body.username);

    serialize(res, token, expires);
    res.status(200);
    res.end();
  } catch (e: any) {
    throw new UnknownException(e.message);
  }
}

async function handleLogout(req: NextApiRequest, res: NextApiResponse) {
  serialize(res, 'null', new Date());
  res.status(200);
  res.end();
}

function serialize(res: NextApiResponse, token: string, expires: Date) {
  setCookie(res, 'firefly-token', token, { expires });
}
