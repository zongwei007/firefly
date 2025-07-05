import { NextRequest } from 'next/server';
import { parse } from 'node-html-parser';

export async function GET(request: NextRequest) {
  const host = request.nextUrl.searchParams.get('host');

  if (!host) {
    return new Response(null, {
      status: 400,
      statusText: 'Parameter host is requried',
    });
  }

  const html = await fetch(host).then(resp => resp.text());
  const iconUrl = new URL(resolveIconUrl(html) || `/favicon.ico`, host).toString();
  const iconResp = await fetch(iconUrl);

  if (!iconResp.ok) {
    return new Response(null, {
      status: 404,
      statusText: `Request ${host} icon ${iconUrl} fail.`,
    });
  }

  const arrayBuffer = await iconResp.arrayBuffer();
  const responseHeaders: [string, string][] = [
    ['Cache-Control', 'public, max-age=31536000, s-maxage=172800, immutable'],
  ];

  if (iconResp.headers.has('Content-Type')) {
    responseHeaders.push(['Content-Type', iconResp.headers.get('Content-Type')!]);
  }
  if (iconResp.headers.has('Content-Length')) {
    responseHeaders.push(['Content-Length', iconResp.headers.get('Content-Length')!]);
  }

  return new Response(Buffer.from(arrayBuffer), {
    headers: responseHeaders,
  });
}

function resolveIconUrl(html: string): string | null {
  const head = (/<head>[\s\S]+<\/head>/.exec(html) || [''])[0];

  const root = head ? parse(head) : parse(html);
  const icons = new Map<number, string>();

  root
    .querySelectorAll('link')
    .filter(ele => ele.getAttribute('rel')?.includes('icon'))
    .forEach(ele => {
      let size;
      const href = ele.getAttribute('href');
      const rel = ele.getAttribute('rel');

      if (!href) {
        return;
      }

      const sizes = ele.getAttribute('sizes');
      if (sizes && sizes.includes('x')) {
        const group = sizes.split(' ').sort();

        size = parseInt(group[group.length - 1].split('x')[0]);
      } else if (href.endsWith('.svg')) {
        size = 128;
      } else if ('apple-touch-icon' === rel) {
        size = 150;
      } else if (href.endsWith('.png') || href.endsWith('.ico')) {
        size = 32;
      }

      if (size) {
        icons.set(size, href);
      }
    });

  const matchSize = Array.from(icons.keys())
    .sort((a, b) => b - a)
    .filter(ele => ele < 200)[0];

  return matchSize ? icons.get(matchSize)! : null;
}
