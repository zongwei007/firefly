/**
 * 生成图标搜索索引。
 *
 * 只输出 public/assets/icons.json（约 153KB，gzip 后 47KB），供设置页的图标选择器
 * 做本地过滤；SVG 路径不在这里下发，而是由 /api/icon/[set]/[name] 按需返回。
 *
 * 运行：node scripts/gen-icons.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import * as simpleIcons from 'simple-icons';

const targetDir = path.resolve(process.cwd(), 'public', 'assets');
const targetFile = path.join(targetDir, 'icons.json');

const icons = Object.values(simpleIcons)
  .filter(icon => icon?.slug && icon?.path)
  .map(icon => ({ slug: icon.slug, title: icon.title, hex: icon.hex }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

await fs.mkdir(targetDir, { recursive: true });
await fs.writeFile(targetFile, JSON.stringify(icons));

console.log(`已生成 ${icons.length} 个图标索引：${path.relative(process.cwd(), targetFile)}`);
