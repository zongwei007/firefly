import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getCookies } from './cookie';
import { ForbiddenException, UnauthenticatedException } from './exception';

export const USERNAME = 'FIREFLY_USERNAME';
export const PASSWORD = 'FIREFLY_PASSWORD';
export const EXPIRE = 'FIREFLY_TOKEN_EXPIRE';

const ALGORITHM = 'aes-256-gcm';

const COOKIE_NAME = 'firefly-token';

type WithProps<Required extends boolean = true> = { required: Required };

export function withUserProps<T, Required extends boolean = true>(
  next: (context: GetServerSidePropsContext & AuthenticationContext<Required>) => Promise<GetServerSidePropsResult<T>>,
  option?: WithProps<Required>
) {
  return async (context: GetServerSidePropsContext) => {
    const user = await parse(getCookies(context.req)[COOKIE_NAME]);

    if (option?.required) {
      if (!user) {
        const search = new URLSearchParams();
        search.append('redirectTo', context.req.url || '/');

        return {
          redirect: {
            destination: '/login?' + search,
            permanent: false,
          },
        };
      }

      return next({ ...context, user });
    } else {
      return next({ ...context, ...({ user } as AuthenticationContext) });
    }
  };
}

export function withUserApi<Required extends boolean = true>(
  next: (req: NextApiRequest, resp: NextApiResponse, context: AuthenticationContext<Required>) => Promise<void>,
  option?: WithProps<Required>
) {
  return async (req: NextApiRequest, resp: NextApiResponse) => {
    const user = await parse(getCookies(req)[COOKIE_NAME]);

    if (option?.required) {
      if (!user) {
        throw new UnauthenticatedException();
      }

      return next(req, resp, { user });
    } else {
      return next(req, resp, { user } as AuthenticationContext);
    }
  };
}

let cfgCache: TokenConfig;

export function getTokenConfig(): TokenConfig {
  if (cfgCache) {
    return cfgCache;
  }

  const username = process.env[USERNAME];
  const password = process.env[PASSWORD];
  const expire = parseInt(process.env[EXPIRE] || '86400');
  const disabled = process.env.DISABLE_LOGIN === 'true';

  if (!disabled && (!username || !password)) {
    throw new Error(`Environment variable '${USERNAME}' and '${PASSWORD}' is required`);
  }

  const sha256 = crypto.createHash('sha256');
  sha256.push(password || '', 'utf-8');

  const md5 = crypto.createHash('md5');
  md5.push(password || '', 'utf-8');

  return (cfgCache = {
    disabled,
    username,
    password,
    expire,
    securityKey: sha256.digest(),
    initVector: md5.digest(),
  });
}

export function parse(tokenValue?: string): IToken | null {
  if (!tokenValue) {
    return null;
  }

  const [token, authTagValue] = tokenValue.split('|');

  if (!authTagValue) {
    throw new ForbiddenException('Invalid token');
  }

  const cfg = getTokenConfig();
  const decipher = crypto.createDecipheriv(ALGORITHM, cfg.securityKey, cfg.initVector);
  decipher.setAuthTag(Buffer.from(authTagValue, 'base64'));

  let body;

  try {
    body = decipher.update(token, 'base64', 'utf-8');
    body += decipher.final('utf-8');
  } catch (e) {
    throw new ForbiddenException('Invalid token');
  }

  const [username, timestampValue, expiresValue] = body.split('|');

  if (!timestampValue || !expiresValue) {
    throw new ForbiddenException('Invalid token');
  }

  const timestamp = parseInt(timestampValue);
  const expires = parseInt(expiresValue);

  if (expires < Date.now()) {
    return null;
  }

  return {
    username,
    timestamp,
    expires,
  };
}

export function build(username: string) {
  const cfg = getTokenConfig();

  const expires = Date.now() + cfg.expire * 1000;
  const cipher = crypto.createCipheriv(ALGORITHM, cfg.securityKey, cfg.initVector);

  let token = cipher.update(`${username}|${Date.now()}|${expires}`, 'utf-8', 'base64');
  token += cipher.final('base64');
  token += '|' + cipher.getAuthTag().toString('base64');

  return { token, expires: new Date(expires) };
}
