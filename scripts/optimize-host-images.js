import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const INPUT_DIR = 'public/hosts';
const OUTPUT_DIR = 'public/hosts/optimized';

// Image configurations
const configs = [
    { width: 320, suffix: '-320w' },  // Mobile
    { width: 640, suffix: '-640w' },  // Desktop 1x and mobile 2x
];

async function optimizeImages() {
    try {
        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        const files = await fs.readdir(INPUT_DIR);
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png)$/i.test(file)
        );

        console.log(`Found ${imageFiles.length} images to optimize...\n`);

        for (const file of imageFiles) {
            const inputPath = path.join(INPUT_DIR, file);
            const baseName = path.parse(file).name;

            console.log(`Processing: ${file}`);

            // Get image metadata
            const metadata = await sharp(inputPath).metadata();
            console.log(`  Original: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024 / 1024).toFixed(2)}MB`);

            // Generate responsive versions
            for (const config of configs) {
                const outputBaseName = `${baseName}${config.suffix}`;

                // WebP version
                await sharp(inputPath)
                    .resize(config.width, config.width, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .webp({ quality: 85 })
                    .toFile(path.join(OUTPUT_DIR, `${outputBaseName}.webp`));

                // AVIF version (better compression)
                await sharp(inputPath)
                    .resize(config.width, config.width, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .avif({ quality: 75 })
                    .toFile(path.join(OUTPUT_DIR, `${outputBaseName}.avif`));

                // JPEG fallback
                await sharp(inputPath)
                    .resize(config.width, config.width, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .jpeg({ quality: 85, progressive: true })
                    .toFile(path.join(OUTPUT_DIR, `${outputBaseName}.jpg`));

                console.log(`  ✓ Generated ${config.width}w versions`);
            }

            console.log('');
        }

        console.log('✓ All images optimized successfully!');
        console.log(`Output directory: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error('Error optimizing images:', error);
        process.exit(1);
    }
}

optimizeImages();
