/**
 * 一次性迁移脚本：把书签的 icon 字段转换成新版格式 `simple-icons:github`。
 *
 * 纯文件处理，不连接任何存储、不读取环境变量：
 *   node scripts/migrate-icons.mjs .data/bookmarks.prod.yml
 *   → .data/bookmarks.prod.migrated.yml（原文件保持不变）
 *
 * 转换规则：
 *   simple-icons/github → simple-icons:github   （已存在则保留）
 *   mdi/home            → simple-icons:home     （仅当 simple-icons 有同名图标）
 *   其余无法识别的一律清空，回退到自动抓取的网站图标
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import * as simpleIcons from 'simple-icons';
import YAML from 'yaml';

const input = process.argv[2];
const output = process.argv[3] ?? (input ? `${input}.migrated.yml` : undefined);

if (!input || !output) {
  console.error('用法：node scripts/migrate-icons.mjs <输入文件> [输出文件]');
  process.exit(1);
}

if (path.resolve(input) === path.resolve(output)) {
  console.error('输出文件不能与输入文件相同，请保留原始数据以便回滚');
  process.exit(1);
}

const icons = new Map(
  Object.values(simpleIcons)
    .filter(icon => icon?.slug)
    .map(icon => [icon.slug, icon])
);
const raw = await fs.readFile(input, 'utf8');
const config = YAML.parse(raw);

if (!Array.isArray(config?.bookmarks)) {
  console.error('输入文件里没有 bookmarks 数组，确认是不是 bookmarks.yml');
  process.exit(1);
}

const report = { kept: [], mapped: [], cleared: [] };

for (const bookmark of config.bookmarks) {
  const original = typeof bookmark.icon === 'string' ? bookmark.icon.trim() : '';
  const result = migrateIcon(original);

  if (result.icon) {
    bookmark.icon = result.icon;
  } else {
    delete bookmark.icon;
  }

  if (result.action === 'mapped') {
    report.mapped.push(`${original} → ${result.icon}（${bookmark.name}）`);
  } else if (result.action === 'cleared' && original) {
    report.cleared.push(`${original}（${bookmark.name}）`);
  } else if (original) {
    report.kept.push(result.icon);
  }
}

await fs.writeFile(output, YAML.stringify(config));

console.log(`已写入 ${path.resolve(output)}`);
console.log(
  `共 ${config.bookmarks.length} 条书签，${report.kept.length} 条保留、${report.mapped.length} 条映射、${report.cleared.length} 条清空`
);

if (report.mapped.length) {
  console.log('\n已映射：');
  report.mapped.forEach(line => console.log(`  ${line}`));
}

if (report.cleared.length) {
  console.log('\n以下书签的自定义图标已清空，将回退为自动抓取的网站图标：');
  report.cleared.forEach(line => console.log(`  ${line}`));
}

function migrateIcon(icon) {
  if (!icon) {
    return { action: 'kept' };
  }

  const [set, ...rest] = icon.split(/[:/]/);
  const name = rest.join('/');

  if (set === 'simple-icons' && icons.has(name)) {
    return { action: 'kept', icon: `simple-icons:${name}` };
  }

  // mdi 图标集已移除，能对上 simple-icons 同名图标的顺便救回来
  if (set === 'mdi' && icons.has(name)) {
    return { action: 'mapped', icon: `simple-icons:${name}` };
  }

  return { action: 'cleared' };
}
