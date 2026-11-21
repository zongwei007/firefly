import { mdiEarth } from '@mdi/js';
import { lookup } from 'node:dns/promises';
import { parse } from 'node-html-parser';
import { isIP } from 'node:net';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/** 第三方服务（favicon.im）的请求超时 */
const THIRD_PARTY_TIMEOUT_MS = 3000;
/** 自抓页面的请求超时，两段加起来留在函数时限以内 */
const DIRECT_TIMEOUT_MS = 5000;
/** HTML 与图标的大小上限 */
const MAX_HTML_BYTES = 1024 * 1024;
const MAX_ICON_BYTES = 512 * 1024;
/** 最多跟随的重定向次数 */
const MAX_REDIRECTS = 3;
/** 命中图标时的缓存：浏览器 1 天、CDN 30 天 */
const SUCCESS_CACHE = 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800';
/** 兜底图标的缓存：短一些，让站点以后能自愈 */
const FAILURE_CACHE = 'public, max-age=300, s-maxage=600';

/**
 * 图标获取顺序：
 *   1. favicon.im（第三方 CDN，覆盖率高、响应快）
 *   2. 直接抓取目标站点，解析 <link rel="icon">
 *   3. 地球图标
 * 内网、回环等非公网地址不发起任何外部请求，直接返回地球图标。
 */
export async function GET(request: NextRequest) {
  const target = parseTarget(request.nextUrl.searchParams.get('host'));

  if (!target) {
    return fallbackIcon();
  }

  try {
    // 内网地址既没有第三方收录，自抓也会被拦，直接兜底
    if (!(await isPublicUrl(target))) {
      return fallbackIcon();
    }

    const remote = await fetchFromFaviconIm(target);

    if (remote) {
      return remote;
    }

    const direct = await fetchDirect(target);

    return direct ?? fallbackIcon();
  } catch (error) {
    console.warn(`获取 ${target.origin} 的图标失败`, error);

    return fallbackIcon();
  }
}

function parseTarget(host: string | null): URL | null {
  if (!host) {
    return null;
  }

  try {
    const url = new URL(host);

    return /^https?:$/.test(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

/** 向 favicon.im 取图标，未收录时它返回 404，据此交给自抓处理 */
async function fetchFromFaviconIm(target: URL): Promise<Response | null> {
  const signal = AbortSignal.timeout(THIRD_PARTY_TIMEOUT_MS);
  const url = new URL(`https://favicon.im/${target.hostname}`);

  url.searchParams.set('larger', 'true');
  // 未找到时返回 404 而不是默认头像，方便判断是否需要回退
  url.searchParams.set('throw-error-on-404', 'true');

  let current = url;

  // favicon.im 会 302 到 a.favicon.im，手动跟随并限制目标域名，避免被当成跳板
  for (let hop = 0; hop < 2; hop++) {
    const response = await fetch(current, {
      redirect: 'manual',
      signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FireflyFavicon/1.0)' },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');

      if (!location) {
        return null;
      }

      const next = new URL(location, current);

      if (!/^https?:$/.test(next.protocol) || !isFaviconImHost(next.hostname)) {
        return null;
      }

      current = next;

      continue;
    }

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.startsWith('image/')) {
      return null;
    }

    const buffer = await readBuffer(response, MAX_ICON_BYTES);

    // 站点存在但没有图标时，它仍可能返回默认的「f」头像，按失败处理
    if (!buffer || isPlaceholderAvatar(buffer, contentType)) {
      return null;
    }

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': SUCCESS_CACHE,
      },
    });
  }

  return null;
}

function isFaviconImHost(hostname: string) {
  return hostname === 'favicon.im' || hostname.endsWith('.favicon.im');
}

function isPlaceholderAvatar(buffer: Buffer, contentType: string): boolean {
  if (!contentType.includes('svg')) {
    return false;
  }

  const text = buffer.toString('utf8');

  return text.includes('viewBox="0 0 100 100"') && text.includes('>f</text>');
}

/** 直接抓取目标站点，解析页面里的 <link rel="icon"> */
async function fetchDirect(target: URL): Promise<Response | null> {
  const signal = AbortSignal.timeout(DIRECT_TIMEOUT_MS);

  const pageResponse = await fetchWithRedirects(target, signal);

  if (!pageResponse.ok) {
    return null;
  }

  const html = await readText(pageResponse, MAX_HTML_BYTES);
  const base = new URL(pageResponse.url || target.toString());
  const iconUrl = resolveIconUrl(html, base);

  let iconResponse = await fetchWithRedirects(new URL(iconUrl), signal);

  if (!iconResponse.ok) {
    iconResponse = await fetchWithRedirects(new URL('/favicon.ico', base), signal);
  }

  if (!iconResponse.ok) {
    return null;
  }

  const contentType = iconResponse.headers.get('content-type') ?? '';

  if (!contentType.startsWith('image/')) {
    return null;
  }

  const buffer = await readBuffer(iconResponse, MAX_ICON_BYTES);

  if (!buffer) {
    return null;
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': SUCCESS_CACHE,
    },
  });
}

async function fetchWithRedirects(url: URL, signal: AbortSignal): Promise<Response> {
  let current = url;

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
    // 每一跳都重新校验，避免通过重定向绕过内网限制
    if (!(await isPublicUrl(current))) {
      throw new Error(`拒绝访问非公网地址：${current.hostname}`);
    }

    const response = await fetch(current, {
      redirect: 'manual',
      signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FireflyFavicon/1.0)' },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');

      if (!location) {
        return response;
      }

      current = new URL(location, current);

      continue;
    }

    return response;
  }

  throw new Error('重定向次数过多');
}

async function isPublicUrl(url: URL): Promise<boolean> {
  if (isIP(url.hostname)) {
    return !isPrivateAddress(url.hostname);
  }

  const addresses = await lookup(url.hostname, { all: true });

  return addresses.length > 0 && addresses.every(address => !isPrivateAddress(address.address));
}

/** 判断是否为私有、回环、链路本地或保留网段 */
function isPrivateAddress(address: string): boolean {
  if (address.includes(':')) {
    const ipv6 = address.toLowerCase();

    if (ipv6 === '::' || ipv6 === '::1') {
      return true;
    }
    // fc00::/7
    if (ipv6.startsWith('fc') || ipv6.startsWith('fd')) {
      return true;
    }
    // fe80::/10
    if (/^fe[89ab]/.test(ipv6)) {
      return true;
    }
    // IPv4 映射地址
    if (ipv6.startsWith('::ffff:')) {
      return isPrivateAddress(ipv6.slice(7));
    }

    return false;
  }

  const parts = address.split('.').map(Number);

  if (parts.length !== 4 || parts.some(part => Number.isNaN(part))) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

/** 从 HTML 里挑一个最合适的图标地址，优先 SVG，其次尺寸最大 */
function resolveIconUrl(html: string, base: URL): string {
  const root = parse(html);
  const candidates: Array<{ href: string; size: number; svg: boolean }> = [];

  for (const element of root.querySelectorAll('link')) {
    const rel = (element.getAttribute('rel') ?? '').toLowerCase().split(/\s+/);
    const isIcon = rel.some(
      value =>
        value === 'icon' ||
        value === 'shortcut' ||
        value === 'apple-touch-icon' ||
        value === 'apple-touch-icon-precomposed' ||
        value === 'mask-icon'
    );

    if (!isIcon) {
      continue;
    }

    const href = element.getAttribute('href');

    if (!href) {
      continue;
    }

    let url: URL;

    try {
      url = new URL(href, base);
    } catch {
      continue;
    }

    if (!/^https?:$/.test(url.protocol)) {
      continue;
    }

    const svg = url.pathname.endsWith('.svg');
    const size =
      parseIconSize(element.getAttribute('sizes')) ?? (svg ? 256 : rel.includes('apple-touch-icon') ? 180 : 32);

    candidates.push({ href: url.toString(), size, svg });
  }

  candidates.sort((a, b) => Number(b.svg) - Number(a.svg) || b.size - a.size);

  return candidates[0]?.href ?? new URL('/favicon.ico', base).toString();
}

function parseIconSize(sizes: string | null | undefined): number | undefined {
  if (!sizes) {
    return undefined;
  }

  const values = sizes
    .toLowerCase()
    .split(/\s+/)
    .map(value => {
      const [width] = value.split('x');
      const size = parseInt(width, 10);

      return Number.isNaN(size) ? 0 : size;
    });
  const max = Math.max(...values, 0);

  return max > 0 ? max : undefined;
}

async function readBuffer(response: Response, limit: number): Promise<Buffer | null> {
  const length = Number(response.headers.get('content-length') ?? 0);

  if (length > limit) {
    return null;
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  return buffer.byteLength > limit ? null : buffer;
}

async function readText(response: Response, limit: number): Promise<string> {
  const buffer = await readBuffer(response, limit);

  return buffer?.toString('utf8') ?? '';
}

function fallbackIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#9e9e9e" d="${mdiEarth}"/></svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': FAILURE_CACHE,
    },
  });
}
