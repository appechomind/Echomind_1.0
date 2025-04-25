const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
    72, 96, 128, 144, 152, 192, 384, 512
];

const sourceFile = path.join(__dirname, '../assets/images/icons/icon-source.svg');
const outputDir = path.join(__dirname, '../assets/images/icons');

async function generateIcons() {
    try {
        // Read the SVG source file
        const svgBuffer = fs.readFileSync(sourceFile);
        
        // Generate each size
        for (const size of sizes) {
            const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
            
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputFile);
            
            console.log(`Generated ${size}x${size} icon`);
        }
        
        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 