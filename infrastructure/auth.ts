import crypto from 'crypto';
import getConfiguration from '@/infrastructure/configuration';
import { cookies } from 'next/headers';

const ALGORITHM = 'aes-256-gcm';

const COOKIE_NAME = 'firefly-token';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export async function getUserInfo() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return parse(token);
}

export async function updateToken(store: Awaited<ReturnType<typeof cookies>>, token: string, expires: Date) {
  store.set(COOKIE_NAME, token, { expires, httpOnly: true });
}
