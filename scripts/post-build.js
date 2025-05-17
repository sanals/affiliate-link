import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Function to create the .nojekyll file
function createNoJekyllFile() {
  const filePath = path.join(distDir, '.nojekyll');
  
  try {
    fs.writeFileSync(filePath, '');
    console.log('Created .nojekyll file');
  } catch (err) {
    console.error('Error creating .nojekyll file:', err);
  }
}

// Function to copy CNAME file if it exists
function copyCnameFile() {
  const sourcePath = path.join(rootDir, 'CNAME');
  const destPath = path.join(distDir, 'CNAME');
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log('Copied CNAME file to dist/');
    } catch (err) {
      console.error('Error copying CNAME file:', err);
    }
  } else {
    try {
      // Create CNAME file with the domain name
      fs.writeFileSync(destPath, 'syrez.co.in');
      console.log('Created CNAME file with syrez.co.in in dist/');
    } catch (err) {
      console.error('Error creating CNAME file:', err);
    }
  }
}

// Function to create client-side routing script for GitHub Pages
function create404Page() {
  // The 404.html file should be in public/ directory and will be copied automatically by Vite
  // We just check if it exists in the dist directory
  const filePath = path.join(distDir, '404.html');
  
  if (!fs.existsSync(filePath)) {
    console.warn('404.html not found in dist directory. Make sure it exists in public/ directory.');
  } else {
    console.log('404.html exists in dist directory.');
  }
}

// Function to ensure all icons are copied properly
function ensureIcons() {
  const publicIconsDir = path.join(rootDir, 'public', 'icons');
  const distIconsDir = path.join(distDir, 'icons');
  
  // Create icons directory in dist if it doesn't exist
  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
    console.log('Created icons directory in dist/');
  }
  
  if (fs.existsSync(publicIconsDir)) {
    try {
      // Copy all files from public/icons to dist/icons
      const files = fs.readdirSync(publicIconsDir);
      for (const file of files) {
        const srcFile = path.join(publicIconsDir, file);
        const destFile = path.join(distIconsDir, file);
        
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
          console.log(`Copied icon: ${file}`);
        }
      }
    } catch (err) {
      console.error('Error copying icons:', err);
    }
  } else {
    console.warn('public/icons directory not found');
  }
}

// Execute the functions
createNoJekyllFile();
copyCnameFile();
create404Page();
ensureIcons();

console.log('Post-build processing completed.'); 