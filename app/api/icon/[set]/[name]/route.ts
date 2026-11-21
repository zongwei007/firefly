import { mdiEarth } from '@mdi/js';
import type { NextRequest } from 'next/server';
import * as simpleIcons from 'simple-icons';

/** 支持的图标集，键为 URL 中的第一段 */
const ICON_SETS: Record<string, Map<string, string>> = {
  'simple-icons': new Map(
    Object.values(simpleIcons)
      .filter(icon => icon?.slug && icon?.path)
      .map(icon => [icon.slug, icon.path])
  ),
};

export const runtime = 'nodejs';

export async function GET(_: NextRequest, { params }: { params: Promise<{ set: string; name: string }> }) {
  const { set, name } = await params;
  const iconPath = ICON_SETS[set]?.get(name);

  if (!iconPath) {
    // 返回地球图标而不是 404，避免数据里写错名称时页面上留下空白
    return new Response(earthSvg(), {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="${iconPath}"/></svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      // 图标内容随 simple-icons 版本变化，但 slug 不变，按 URL 长期缓存即可
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    },
  });
}

function earthSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#9e9e9e" d="${mdiEarth}"/></svg>`;
}
