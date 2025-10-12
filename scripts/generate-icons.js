const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSvg = fs.readFileSync(path.join(__dirname, '../app/icon.svg'));

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateIcons() {
  for (const { size, name } of sizes) {
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '../public', name));
    console.log(`✓ Generated ${name}`);
  }
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
