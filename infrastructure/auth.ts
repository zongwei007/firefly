import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getCookies, setCookie } from 'infrastructure/cookie';
import { UnauthenticatedException } from 'infrastructure/exception';
import getConfiguration from 'infrastructure/configuration';
import { ServerResponse } from 'http';

const ALGORITHM = 'aes-256-gcm';

const COOKIE_NAME = 'firefly-token';

const ONE_DAY = 1000 * 60 * 60 * 24;

type WithProps<Required extends boolean = false> = { required: Required };

export function withUserProps<T, Required extends boolean = false>(
  next: (context: GetServerSidePropsContext & AuthenticationContext<Required>) => Promise<GetServerSidePropsResult<T>>,
  option?: WithProps<Required>
) {
  return async (context: GetServerSidePropsContext) => {
    const user = await parse(getCookies(context.req)[COOKIE_NAME]);

    if (option?.required && !user) {
      return {
        redirect: {
          destination: '/login?' + new URLSearchParams([['redirectTo', context.resolvedUrl]]),
          permanent: false,
        },
      };
    }

    if (user && Date.now() - user.timestamp > ONE_DAY) {
      const { token, expires } = build(user.username);

      updateToken(context.res, token, expires);
    }

    return next({ ...context, ...({ user } as AuthenticationContext) });
  };
}

export function withUserApi<Required extends boolean = false>(
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

  const { firefly } = getConfiguration();

  const sha256 = crypto.createHash('sha256');
  sha256.update(firefly.password || '', 'utf-8');

  const md5 = crypto.createHash('md5');
  md5.update(firefly.password || '', 'utf-8');

  return (cfgCache = {
    disabled: firefly.disableLogin,
    username: firefly.username,
    password: firefly.password,
    expire: firefly.expire,
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
    return null;
  }

  const cfg = getTokenConfig();
  const decipher = crypto.createDecipheriv(ALGORITHM, cfg.securityKey, cfg.initVector);
  decipher.setAuthTag(Buffer.from(authTagValue, 'base64'));

  let body;

  try {
    body = decipher.update(token, 'base64', 'utf-8');
    body += decipher.final('utf-8');
  } catch (e) {
    return null;
  }

  const [username, timestampValue, expiresValue] = body.split('|');

  if (!timestampValue || !expiresValue) {
    return null;
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

export function updateToken(res: ServerResponse, token: string, expires: Date) {
  setCookie(res, 'firefly-token', token, { expires });
}
