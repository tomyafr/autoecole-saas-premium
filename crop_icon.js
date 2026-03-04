const sharp = require('sharp');
const fs = require('fs');

async function processIcon() {
    console.log('Loading image...');
    const trimmed = await sharp('public/app-icon.png')
        .trim()
        .toBuffer();

    const metadata = await sharp(trimmed).metadata();
    console.log(`Trimmed size: ${metadata.width}x${metadata.height}`);

    console.log('Generating 512x512 icon...');
    await sharp({
        create: {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 11, g: 15, b: 20, alpha: 1 }
        }
    })
        .composite([
            {
                input: await sharp(trimmed)
                    .resize({ width: 460, height: 460, fit: 'inside' })
                    .toBuffer(),
                gravity: 'center'
            }
        ])
        .png()
        .toFile('public/app-icon.png');

    console.log('Generating 192x192 icon...');
    await sharp('public/app-icon.png')
        .resize(192, 192)
        .png()
        .toFile('public/app-icon-192.png');

    console.log('Icons generated successfully.');
}

processIcon().catch(console.error);
