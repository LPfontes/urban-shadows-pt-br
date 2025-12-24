import fs from 'fs';
import path from 'path';

// CHANGE THIS to the path where your JSON files are located
const packsDir = './src/packs'; 

function checkDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            checkDirectory(fullPath);
        } else if (path.extname(file) === '.json') {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // Check for BOM specifically
                if (content.charCodeAt(0) === 0xFEFF) {
                    console.error(`[BOM DETECTED] ${fullPath} starts with a Byte Order Mark.`);
                    // Remove BOM and save
                    fs.writeFileSync(fullPath, content.slice(1), 'utf8');
                    console.log(`[FIXED] Removed BOM from ${fullPath}`);
                }
                JSON.parse(content);
            } catch (e) {
                console.error(`[INVALID JSON] : ${e.message}`);
            }
        }
    }
}

console.log('Scanning for invalid JSON files...');
checkDirectory(packsDir);
