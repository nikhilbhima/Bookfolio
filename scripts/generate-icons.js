const sharp = require('sharp');
const { default: pngToIco } = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const iconSvg = fs.readFileSync(path.join(__dirname, '../app/icon.svg'));

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateIcons() {
  // Generate PNG icons
  for (const { size, name } of sizes) {
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '../public', name));
    console.log(`✓ Generated ${name}`);
  }

  // Generate favicon.ico (32x32 and 16x16)
  const faviconSizes = [32, 16];
  const faviconPngs = [];

  // Create temporary PNGs for favicon
  for (const size of faviconSizes) {
    const tempPath = path.join(__dirname, `../public/temp-favicon-${size}.png`);
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(tempPath);
    faviconPngs.push(tempPath);
  }

  // Convert PNGs to ICO
  const icoBuffer = await pngToIco(faviconPngs);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  console.log('✓ Generated favicon.ico');

  // Clean up temporary files
  for (const tempPath of faviconPngs) {
    fs.unlinkSync(tempPath);
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
