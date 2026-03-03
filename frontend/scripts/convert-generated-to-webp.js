const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'public', 'generated');

async function run() {
    if (!fs.existsSync(dir)) {
        console.error('Directory does not exist:', dir);
        return;
    }

    const files = fs.readdirSync(dir);
    let converted = 0;
    let skipped = 0;

    for (const file of files) {
        if (file.endsWith('.webp')) continue; // Skip already converted

        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const baseName = path.basename(file, path.extname(file)); // e.g. "image" from "image.png"
            const isThumb = baseName.endsWith('_thumb');
            const targetBase = isThumb ? baseName : baseName;

            const targetName = `${targetBase}.webp`;
            const targetPath = path.join(dir, targetName);

            if (fs.existsSync(targetPath)) {
                console.log(`Skipping (already exists): ${targetName}`);
                skipped++;
                continue;
            }

            console.log(`Converting ${file} -> ${targetName}`);
            try {
                await sharp(path.join(dir, file))
                    .webp({ quality: 85 })
                    .toFile(targetPath);
                converted++;
            } catch (e) {
                console.error(`Error converting ${file}:`, e);
            }
        }
    }

    console.log(`\nDone! Converted: ${converted}, Skipped (already exist): ${skipped}`);
}

run();
