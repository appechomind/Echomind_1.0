const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const excludeDirs = ['node_modules', '.git', 'backup_versions'];

// Navigation dependencies to add
const navigationDeps = `
    <link rel="stylesheet" href="/styles/navigation.css">
    <script src="/scripts/navigation.js"></script>`;

// Function to find all HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                findHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to update a single HTML file
function updateHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if navigation is already added
    if (content.includes('navigation.css')) {
        console.log(`Skipping ${filePath} - navigation already present`);
        return;
    }
    
    // Add navigation dependencies
    content = content.replace('</head>', `${navigationDeps}\n</head>`);
    
    // Calculate relative path to root
    const relativeToRoot = path.relative(path.dirname(filePath), rootDir).replace(/\\/g, '/');
    const adjustedDeps = navigationDeps.replace(/\/styles\//g, `${relativeToRoot}/styles/`)
                                     .replace(/\/scripts\//g, `${relativeToRoot}/scripts/`);
    
    // Update the content with correct paths
    content = content.replace('</head>', `${adjustedDeps}\n</head>`);
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// Main execution
console.log('Finding HTML files...');
const htmlFiles = findHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files`);

htmlFiles.forEach(file => {
    try {
        updateHtmlFile(file);
    } catch (error) {
        console.error(`Error updating ${file}:`, error);
    }
});

console.log('Navigation update complete!'); 