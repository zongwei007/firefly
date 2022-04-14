import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'node-html-parser';

async function handler(req: NextApiRequest, res: NextApiResponse<Buffer | string>) {
  let { host } = req.query;

  if (!host) {
    res.status(400).send('Query parameter host is required');
    return;
  }

  if (Array.isArray(host)) {
    host = host[0];
  }

  const html = await fetch(host).then(resp => resp.text());
  const iconUrl = new URL(resolveIconUrl(html) || `/favicon.ico`, host).toString();
  const iconResp = await fetch(iconUrl);

  if (!iconResp.ok) {
    res.status(400).send(`Request ${host} icon ${iconUrl} fail.`);
    return;
  }

  const arrayBuffer = await iconResp.arrayBuffer();

  res.status(200);
  res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=172800, immutable');

  if (iconResp.headers.has('Content-Type')) {
    res.setHeader('Content-Type', iconResp.headers.get('Content-Type')!);
  }
  if (iconResp.headers.has('Content-Length')) {
    res.setHeader('Content-Length', iconResp.headers.get('Content-Length')!);
  }

  res.write(Buffer.from(arrayBuffer), 'binary');
  res.end();
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
        size = 192;
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

export default handler;
