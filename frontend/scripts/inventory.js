/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const images = new Set();
const outPath = path.join(__dirname, '..', 'inventory.md');
const frontendDir = path.join(__dirname, '..');
const generatedDir = path.join(frontendDir, 'public', 'generated');

// 1. Read products.json
const productsStr = fs.readFileSync(path.join(frontendDir, 'data', 'products.json'), 'utf-8');
const productsMatches = [...productsStr.matchAll(/\/generated\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp[a-z\.]*)/gi)];
productsMatches.forEach(m => images.add(m[0]));

// 2. Read App and Components
const dirsToScan = [
  path.join(frontendDir, 'app'),
  path.join(frontendDir, 'components')
];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const routeMatches = [...content.matchAll(/\/generated\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp[a-z\.]*)/gi)];
      routeMatches.forEach(m => images.add(m[0]));
    }
  }
}

dirsToScan.forEach(scanDir);

let md = '# Image Inventory\n\n| Path in Code | Exists on Disk | Extension |\n|---|---|---|\n';
let total = 0, existsCount = 0;

const sortedImages = Array.from(images).sort();
for (const img of sortedImages) {
  const p = img.replace('/generated/', '');
  const diskPath = path.join(generatedDir, p);
  const exists = fs.existsSync(diskPath);
  const ext = path.extname(p);
  md += `| ${img} | ${exists ? '✅ YES' : '❌ NO'} | ${ext} |\n`;
  total++;
  if (exists) existsCount++;
}

md += `\n**Total references:** ${total}\n**Files on disk:** ${existsCount}`;

fs.writeFileSync(outPath, md);
console.log(`Inventory written to ${outPath}`);
