import type { NextApiResponse } from 'next';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie';
import { parse, serialize } from 'cookie';
import type { IncomingMessage } from 'http';

export function setCookie(res: NextApiResponse, name: string, value: string, options?: CookieSerializeOptions) {
  res.setHeader('Set-Cookie', serialize(name, value, { sameSite: true, httpOnly: true, path: '/', ...options }));
}

export function getCookies(req: IncomingMessage, options?: CookieParseOptions) {
  return parse(req.headers.cookie || '', options);
}
