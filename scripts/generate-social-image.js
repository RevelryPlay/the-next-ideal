import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Social share image dimensions (recommended for og:image)
const WIDTH = 1200;
const HEIGHT = 630;

// Theme color from config
const BACKGROUND_COLOR = '#1a1a2e';

// Logo size (will be centered)
const LOGO_SIZE = 400;

async function generateSocialImage() {
  // Read the SVG logo
  const logoPath = join(publicDir, 'TNI-logo_full-color-1.svg');
  const logoSvg = readFileSync(logoPath, 'utf8');

  // Convert SVG logo to PNG buffer at desired size
  const logoBuffer = await sharp(Buffer.from(logoSvg))
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Calculate position to center the logo
  const left = Math.round((WIDTH - LOGO_SIZE) / 2);
  const top = Math.round((HEIGHT - LOGO_SIZE) / 2);

  // Create the social share image
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BACKGROUND_COLOR
    }
  })
    .composite([
      {
        input: logoBuffer,
        left: left,
        top: top
      }
    ])
    .png()
    .toFile(join(publicDir, 'social-share.png'));

  console.log('Social share image created: public/social-share.png');
  console.log(`Dimensions: ${WIDTH}x${HEIGHT}px`);
}

generateSocialImage().catch(console.error);
