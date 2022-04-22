const fs = require('fs');
const path = require('path');

console.log('Starting...');

const meta = [];

copyMdiIcon(meta);
copySimpleIcon(meta);

fs.writeFileSync(path.resolve(process.cwd(), 'public', 'assets', 'icon-meta.json'), JSON.stringify(meta));

console.log('Done!');

function copyMdiIcon(meta) {
  const sourceDir = path.resolve(process.cwd(), 'node_modules', '@mdi', 'svg');
  const targetDir = path.resolve(process.cwd(), 'public', 'assets', 'mdi');

  const icons = JSON.parse(fs.readFileSync(path.resolve(sourceDir, 'meta.json'), 'utf8'));

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true });
  }

  fs.mkdirSync(targetDir);

  for (const icon of icons) {
    const svgPath = path.resolve(sourceDir, 'svg', icon.name + '.svg');
    const targetPath = path.resolve(targetDir, icon.name + '.svg');

    fs.copyFileSync(svgPath, targetPath);

    meta.push({
      id: icon.id,
      name: `mdi/${icon.name}`,
      aliases: icon.aliases,
      tags: icon.tags,
    });
  }
}

function copySimpleIcon(meta) {
  const sourceDir = path.resolve(process.cwd(), 'node_modules', 'simple-icons');
  const targetDir = path.resolve(process.cwd(), 'public', 'assets', 'simple-icons');

  const icons = require('simple-icons');

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true });
  }

  fs.mkdirSync(targetDir);

  for (const icon of Object.values(icons)) {
    const svgPath = path.resolve(sourceDir, 'icons', icon.slug + '.svg');
    const targetPath = path.resolve(targetDir, icon.slug + '.svg');

    fs.copyFileSync(svgPath, targetPath);

    meta.push({
      id: icon.hex,
      name: `simple-icons/${icon.slug}`,
      aliases: [],
      tags: [],
    });
  }
}
