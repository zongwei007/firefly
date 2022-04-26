import type { ServerResponse } from 'http';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie';
import { parse, serialize } from 'cookie';
import type { IncomingMessage } from 'http';

export function setCookie(res: ServerResponse, name: string, value: string, options?: CookieSerializeOptions) {
  res.setHeader('Set-Cookie', serialize(name, value, { sameSite: true, httpOnly: true, path: '/', ...options }));
}

export function getCookies(req: IncomingMessage, options?: CookieParseOptions) {
  return parse(req.headers.cookie || '', options);
}
