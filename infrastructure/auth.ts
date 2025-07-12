import type { NextRequest } from 'next/server';
import getConfiguration from './configuration.ts';
import { cookies } from 'next/headers.js';

const ALGORITHM = 'HMAC';
const HASH_ALGORITHM = 'SHA-256';

const COOKIE_NAME = 'firefly-token';

let tokenSecurityKey: CryptoKey;

type RequestCookies = NextRequest['cookies'] | Awaited<ReturnType<typeof cookies>>;

async function getTokenSecurityKey() {
  if (tokenSecurityKey) {
    return tokenSecurityKey;
  }

  const { firefly } = getConfiguration();
  const keyData = new TextEncoder().encode(firefly.password || '');

  return (tokenSecurityKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM, hash: HASH_ALGORITHM },
    false,
    ['sign', 'verify']
  ));
}

export async function parse(tokenValue?: string): Promise<IToken | null> {
  if (!tokenValue) {
    return null;
  }

  const [token, signature] = tokenValue.split('|');

  if (!signature) {
    return null;
  }

  const securityKey = await getTokenSecurityKey();
  const data = Buffer.from(token, 'base64');

  try {
    const isValid = await crypto.subtle.verify(ALGORITHM, securityKey, Buffer.from(signature, 'base64'), data);

    if (!isValid) {
      return null;
    }

    const body = data.toString('utf-8');
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
  } catch {
    return null;
  }
}

export async function build(username: string) {
  const { firefly } = getConfiguration();
  const securityKey = await getTokenSecurityKey();
  const expires = Date.now() + firefly.expire * 1000;
  const payload = `${username}|${Date.now()}|${expires}`;

  const data = new TextEncoder().encode(payload);
  const signature = await crypto.subtle.sign(ALGORITHM, securityKey, data);

  const token = `${Buffer.from(data).toString('base64')}|${Buffer.from(signature).toString('base64')}`;

  return { token, expires: new Date(expires) };
}

export async function getUserInfo(cookieSource?: RequestCookies): Promise<IToken | null> {
  // 需要在 middleware 中使用，通过传入参数兼容
  const cookieStore: RequestCookies = cookieSource ?? (await cookies());
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return await parse(token);
}

export async function updateToken(store: RequestCookies, token: string, expires: Date) {
  // nextjs 限制了 cookie 只能从 action 中设置，在函数内嵌套获取都不行
  store.set(COOKIE_NAME, token, { expires, httpOnly: true });
}
