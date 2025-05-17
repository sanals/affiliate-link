import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');

// Ensure .nojekyll file exists to prevent GitHub Pages from ignoring files that begin with an underscore
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Copy CNAME file if it exists in the root
if (fs.existsSync(path.resolve(__dirname, '../CNAME'))) {
  const cname = fs.readFileSync(path.resolve(__dirname, '../CNAME'), 'utf8');
  fs.writeFileSync(path.join(distDir, 'CNAME'), cname);
} else {
  // Create a CNAME file with syrez.co.in
  fs.writeFileSync(path.join(distDir, 'CNAME'), 'syrez.co.in');
}

// Ensure all HTML files use relative paths for assets
const processHTMLFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace absolute paths with relative paths
  const updatedContent = content
    .replace(/href="\//g, 'href="./')
    .replace(/src="\//g, 'src="./')
    .replace(/url\(\//g, 'url\(./');
  
  fs.writeFileSync(filePath, updatedContent);
  console.log(`✅ Updated paths in ${path.basename(filePath)}`);
};

// Process all HTML files in the dist directory
const htmlFiles = fs.readdirSync(distDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(distDir, file));

htmlFiles.forEach(processHTMLFile);

// Create redirects file for netlify and other hosting platforms
if (!fs.existsSync(path.join(distDir, '_redirects'))) {
  fs.writeFileSync(path.join(distDir, '_redirects'), '/* /index.html 200');
  console.log('✅ Created _redirects file for SPA routing');
}

console.log('✅ Post-build script completed successfully!'); 