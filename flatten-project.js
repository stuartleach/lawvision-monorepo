import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const OUTPUT_FILE = 'project-flattened.txt';
const EXCLUDE_DIRS = ['node_modules', '.git']; // Add other directories to exclude if needed

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively read directory and concatenate file contents
function readDirectory(dir, fileContent = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            if (!EXCLUDE_DIRS.some(excludeDir => filePath.includes(excludeDir))) {
                console.log(`Entering directory: ${filePath}`);
                // Recursively read directory
                fileContent = readDirectory(filePath, fileContent);
            } else {
                console.log(`Excluding directory: ${filePath}`);
            }
        } else if (stats.isFile()) {
            if (filePath.includes('node_modules')
                || filePath.includes('.git') || filePath.includes('project-flattened.txt')
                || filePath.includes('package-lock.json') || filePath.includes('xml')
                || filePath.includes('lock')
                || filePath.includes(OUTPUT_FILE) || filePath.includes("package-lock.json") || filePath.includes("xml")) {
                console.log(`Excluding file: ${filePath}`);

            } else {
                console.log(`Reading file: ${filePath}`);
                // Read file content
                const content = fs.readFileSync(filePath, 'utf8');
                fileContent += `\n\n// File: ${filePath}\n\n${content}`;
            }
        }
    });

    return fileContent;
}

// Main function to flatten project
function flattenProject() {
    const projectDir = __dirname; // Get current script directory
    let fileContent = '';

    // if file already exists, delete it
    if (fs.existsSync(OUTPUT_FILE)) {
        fs.unlinkSync(OUTPUT_FILE);
    }

    fileContent = readDirectory(projectDir);

    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
    console.log(`Project flattened into ${OUTPUT_FILE}`);
}

// Execute the script
flattenProject();
