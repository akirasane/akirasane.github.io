import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function convertToWebP() {
  const imagePath = join(projectRoot, 'Images', 'profile.png');
  const outputPath = join(projectRoot, 'Images', 'profile.webp');

  try {
    await sharp(imagePath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    console.log('✓ Successfully converted profile.png to profile.webp');
  } catch (error) {
    console.error('✗ Error converting image:', error);
    process.exit(1);
  }
}

convertToWebP();
