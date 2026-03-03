/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..');
const generatedDir = path.join(frontendDir, 'public', 'generated');

const dirsToScan = [
    path.join(frontendDir, 'app'),
    path.join(frontendDir, 'components')
];

function webpExistsFor(filePath) { // e.g. /generated/img.png
    const p = filePath.replace('/generated/', '');
    const baseName = path.basename(p, path.extname(p));
    const targetName = `${baseName}.webp`;
    const targetPath = path.join(generatedDir, targetName);
    return fs.existsSync(targetPath);
}

function processContent(content) {
    let newContent = content;
    const matches = [...content.matchAll(/\/generated\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg)/gi)];
    let replacedCount = 0;

    // sort descending by index to replace from end to start without messing up indices
    matches.sort((a, b) => b.index - a.index);

    for (const match of matches) {
        const originalString = match[0];
        if (webpExistsFor(originalString)) {
            const baseName = path.basename(originalString, path.extname(originalString));
            const targetString = `/generated/${baseName}.webp`;

            newContent = newContent.substring(0, match.index) + targetString + newContent.substring(match.index + originalString.length);
            replacedCount++;
        }
    }
    return { newContent, replacedCount };
}

console.log('--- Updating Components & Pages ---');
function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const { newContent, replacedCount } = processContent(content);
            if (replacedCount > 0) {
                fs.writeFileSync(fullPath, newContent, 'utf-8');
                console.log(`Updated ${replacedCount} references in ${path.relative(frontendDir, fullPath)}`);
            }
        }
    }
}

dirsToScan.forEach(scanDir);

console.log('\n--- Updating products.json ---');
const productsFile = path.join(frontendDir, 'data', 'products.json');
if (fs.existsSync(productsFile)) {
    const content = fs.readFileSync(productsFile, 'utf-8');
    const { newContent, replacedCount } = processContent(content);
    if (replacedCount > 0) {
        fs.writeFileSync(productsFile, newContent, 'utf-8');
        console.log(`Updated ${replacedCount} references in data/products.json`);
    } else {
        console.log('No eligible references found in data/products.json to update.');
    }
}

console.log('Done!');
