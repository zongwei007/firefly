import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as simpleIcons from 'simple-icons/icons';

console.log('Starting...');

try {
  const meta = [];

  await copyMdiIcon(meta);
  await copySimpleIcon(meta);

  await fs.writeFile(
    path.resolve(process.cwd(), 'public', 'assets', 'icon-meta.json'), 
    JSON.stringify(meta)
  );

  console.log('Done!');
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}

async function copyMdiIcon(meta) {
  const sourceDir = path.resolve(process.cwd(), 'node_modules', '@mdi', 'svg');
  const targetDir = path.resolve(process.cwd(), 'public', 'assets', 'mdi');

  const content = await fs.readFile(path.resolve(sourceDir, 'meta.json'), 'utf8');
  const icons = JSON.parse(content);

  if (existsSync(targetDir)) {
    await fs.rm(targetDir, { recursive: true });
  }

  await fs.mkdir(targetDir);

  for (const icon of icons) {
    const svgPath = path.resolve(sourceDir, 'svg', icon.name + '.svg');
    const targetPath = path.resolve(targetDir, icon.name + '.svg');

    await fs.copyFile(svgPath, targetPath);

    meta.push({
      id: icon.id,
      name: `mdi/${icon.name}`,
      aliases: icon.aliases,
      tags: icon.tags,
    });
  }
}

async function copySimpleIcon(meta) {
  const sourceDir = path.resolve(process.cwd(), 'node_modules', 'simple-icons');
  const targetDir = path.resolve(process.cwd(), 'public', 'assets', 'simple-icons');
  
  if (existsSync(targetDir)) {
    await fs.rm(targetDir, { recursive: true });
  }

  await fs.mkdir(targetDir);

  for (const icon of Object.values(simpleIcons)) {
    const svgPath = path.resolve(sourceDir, 'icons', icon.slug + '.svg');
    const targetPath = path.resolve(targetDir, icon.slug + '.svg');

    await fs.copyFile(svgPath, targetPath);

    meta.push({
      id: icon.hex,
      name: `simple-icons/${icon.slug}`,
      aliases: [],
      tags: [],
    });
  }
}
