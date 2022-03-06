const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(process.cwd(), 'node_modules', '@mdi', 'svg');
const targetDir = path.resolve(process.cwd(), 'public', 'assets', 'mdi');

const icons = JSON.parse(fs.readFileSync(path.resolve(sourceDir, 'meta.json'), 'utf8'));

console.log('Starting...');

if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true });
}

fs.mkdirSync(targetDir);

for (const icon of icons) {
  const svgPath = path.resolve(sourceDir, 'svg', icon.name + '.svg');
  const targetPath = path.resolve(targetDir, icon.name + '.svg');

  fs.copyFileSync(svgPath, targetPath);
}

fs.copyFileSync(path.resolve(sourceDir, 'meta.json'), path.resolve(targetDir, 'meta.json'));

console.log('Done!');
