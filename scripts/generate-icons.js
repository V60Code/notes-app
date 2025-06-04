import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  72,
  96,
  128,
  144,
  152,
  192,
  384,
  512
];

async function generateIcons() {
  const inputFile = join(__dirname, '../public/icons/icon-base.svg');
  const outputDir = join(__dirname, '../public/icons');

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Generate icons for each size
  for (const size of sizes) {
    await sharp(inputFile)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, `icon-${size}x${size}.png`));
    
    console.log(`Generated ${size}x${size} icon`);
  }

  // Generate badge icon
  await sharp(inputFile)
    .resize(72, 72)
    .png()
    .toFile(join(outputDir, 'badge-72x72.png'));
  
  console.log('Generated badge icon');

  // Generate maskable icon (with padding)
  await sharp(inputFile)
    .resize(192, 192, {
      fit: 'contain',
      background: { r: 74, g: 144, b: 226, alpha: 1 } // #4a90e2
    })
    .png()
    .toFile(join(outputDir, 'icon-192x192-maskable.png'));
  
  console.log('Generated maskable icon');
}

generateIcons().catch(console.error); 