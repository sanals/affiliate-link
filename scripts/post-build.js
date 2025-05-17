import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');

console.log('🔄 Running post-build script...');

// Ensure .nojekyll file exists to prevent GitHub Pages from ignoring files that begin with an underscore
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✅ Created .nojekyll file');

// Copy CNAME file if it exists in the root
if (fs.existsSync(path.resolve(__dirname, '../CNAME'))) {
  const cname = fs.readFileSync(path.resolve(__dirname, '../CNAME'), 'utf8');
  fs.writeFileSync(path.join(distDir, 'CNAME'), cname);
  console.log(`✅ Copied CNAME file: ${cname.trim()}`);
} else {
  // Create a CNAME file with syrez.co.in
  fs.writeFileSync(path.join(distDir, 'CNAME'), 'syrez.co.in');
  console.log('✅ Created CNAME file with syrez.co.in');
}

// Ensure manifest.json has correct paths
if (fs.existsSync(path.join(distDir, 'manifest.json'))) {
  try {
    const manifestPath = path.join(distDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Update start_url and scope to use relative paths
    manifest.start_url = './';
    manifest.scope = './';
    
    // Fix shortcuts URLs
    if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
      manifest.shortcuts = manifest.shortcuts.map(shortcut => {
        if (shortcut.url && shortcut.url.startsWith('/')) {
          shortcut.url = '.' + shortcut.url;
        }
        return shortcut;
      });
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Updated manifest.json paths');
  } catch (error) {
    console.error('❌ Error updating manifest.json:', error);
  }
}

// Process inline base64-encoded manifest data
const processInlineManifest = (content) => {
  // Look for base64-encoded manifest data
  const manifestMatch = content.match(/href="data:application\/json;base64,([^"]+)"/);
  if (!manifestMatch) return content;

  try {
    // Decode the base64 manifest
    const base64Data = manifestMatch[1];
    const manifestData = Buffer.from(base64Data, 'base64').toString('utf8');

    // Fix the paths in the manifest
    const fixedManifestData = manifestData
      .replace(/\"start_url\"\s*:\s*\"\/affiliate-link\/\"/g, '"start_url":".\/"')
      .replace(/\"scope\"\s*:\s*\"\/affiliate-link\/\"/g, '"scope":".\/"')
      .replace(/\"url\"\s*:\s*\"\/affiliate-link\/\?/g, '"url":".\/?');

    // Re-encode the manifest
    const fixedBase64 = Buffer.from(fixedManifestData).toString('base64');
    
    // Replace the manifest in the content
    return content.replace(
      new RegExp(`href="data:application/json;base64,${base64Data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), 
      `href="data:application/json;base64,${fixedBase64}"`
    );
  } catch (error) {
    console.error('❌ Error processing inline manifest:', error);
    return content;
  }
};

// Ensure all HTML files use relative paths for assets
const processHTMLFile = (filePath) => {
  console.log(`🔄 Processing file: ${path.basename(filePath)}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace absolute paths with relative paths
  let updatedContent = content
    .replace(/href="\//g, 'href="./')
    .replace(/src="\//g, 'src="./')
    .replace(/url\(\//g, 'url(./')
    // Fix absolute imports in script tags
    .replace(/from"\//g, 'from"./')
    .replace(/import"\//g, 'import"./')
    // Fix potential PWA manifest references
    .replace(/"\/manifest.json"/g, '"./manifest.json"')
    .replace(/"\/manifest.webmanifest"/g, '"./manifest.webmanifest"');
  
  // Specifically handle GitHub Pages paths with /affiliate-link/ prefix
  updatedContent = updatedContent
    .replace(/href="\/affiliate-link\//g, 'href="./')
    .replace(/src="\/affiliate-link\//g, 'src="./')
    .replace(/url\(\/affiliate-link\//g, 'url(./')
    // Also fix if the leading slash was already changed to dot-slash
    .replace(/href="\.\/affiliate-link\//g, 'href="./')
    .replace(/src="\.\/affiliate-link\//g, 'src="./')
    .replace(/url\(\.\/affiliate-link\//g, 'url(./');

  // Also handle asset imports with crossorigin attribute
  updatedContent = updatedContent
    .replace(/src="\/affiliate-link\/assets\//g, 'src="./assets/')
    .replace(/href="\/affiliate-link\/assets\//g, 'href="./assets/')
    .replace(/from"\/affiliate-link\/assets\//g, 'from"./assets/');
  
  // Process any inline base64-encoded manifest
  updatedContent = processInlineManifest(updatedContent);
  
  fs.writeFileSync(filePath, updatedContent);
  
  // Verify changes were applied
  const updatedFileContent = fs.readFileSync(filePath, 'utf8');
  const hasAbsolutePaths = updatedFileContent.includes('src="/affiliate-link/') || 
                          updatedFileContent.includes('href="/affiliate-link/');
  
  if (hasAbsolutePaths) {
    console.warn(`⚠️ Warning: ${path.basename(filePath)} still contains absolute paths after processing!`);
  } else {
    console.log(`✅ Updated paths in ${path.basename(filePath)}`);
  }
};

// Process all HTML and JS files in the dist directory
const processDir = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules to prevent infinite recursion
      if (entry.name !== 'node_modules') {
        processDir(entryPath);
      }
    } else {
      // Process HTML files
      if (entry.name.endsWith('.html')) {
        processHTMLFile(entryPath);
      }
      
      // Process service worker files
      if (entry.name === 'sw.js' || entry.name === 'service-worker.js' || 
          entry.name.includes('workbox') || entry.name.includes('register-sw')) {
        try {
          console.log(`🔄 Processing service worker file: ${entry.name}`);
          const content = fs.readFileSync(entryPath, 'utf8');
          
          // Handle both standard absolute paths and GitHub Pages paths
          const updatedContent = content
            .replace(/"\//g, '"./')
            .replace(/'\//g, "'./")
            .replace(/"\/affiliate-link\//g, '"./') 
            .replace(/'\/affiliate-link\//g, "'./")
            // Handle if the leading slash was already changed to dot-slash
            .replace(/"\.\/affiliate-link\//g, '"./') 
            .replace(/'\.\/affiliate-link\//g, "'./");
            
          fs.writeFileSync(entryPath, updatedContent);
          console.log(`✅ Updated paths in service worker file: ${entry.name}`);
        } catch (error) {
          console.error(`❌ Error processing service worker file ${entry.name}:`, error);
        }
      }
      
      // Also check JS files for asset references
      if (entry.name.endsWith('.js') && !entry.name.includes('workbox') && !entry.name.includes('sw')) {
        try {
          const content = fs.readFileSync(entryPath, 'utf8');
          
          // Only modify if there are /affiliate-link/ references
          if (content.includes('/affiliate-link/') || content.includes('./affiliate-link/')) {
            console.log(`🔄 Processing JS file with affiliate-link refs: ${entry.name}`);
            const updatedContent = content
              .replace(/\/affiliate-link\//g, './')
              .replace(/\.\/affiliate-link\//g, './');
              
            fs.writeFileSync(entryPath, updatedContent);
            console.log(`✅ Updated paths in JS file: ${entry.name}`);
          }
        } catch (error) {
          console.error(`❌ Error processing JS file ${entry.name}:`, error);
        }
      }
    }
  }
};

// Process all files in the dist directory
processDir(distDir);

// Also check the docs directory if it exists
const docsDir = path.resolve(__dirname, '../docs');
if (fs.existsSync(docsDir)) {
  console.log('Found docs directory, also processing files there...');
  processDir(docsDir);
}

// Create redirects file for netlify and other hosting platforms
if (!fs.existsSync(path.join(distDir, '_redirects'))) {
  fs.writeFileSync(path.join(distDir, '_redirects'), '/* /index.html 200');
  console.log('✅ Created _redirects file for SPA routing');
}

// Create a 404.html that redirects to index.html for GitHub Pages SPA support
const notFoundPage = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Amazon Affiliate Link Converter | Syrez</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      var segmentCount = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
        l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
        (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <h1>Redirecting...</h1>
    <p>If you are not redirected automatically, <a href="./index.html">click here</a>.</p>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, '404.html'), notFoundPage);
console.log('✅ Created 404.html for SPA GitHub Pages support');

// Create a simple report file with build information
const buildInfo = {
  timestamp: new Date().toISOString(),
  buildPath: distDir,
  files: fs.readdirSync(distDir).length,
  domain: fs.readFileSync(path.join(distDir, 'CNAME'), 'utf8').trim()
};

fs.writeFileSync(
  path.join(distDir, 'build-info.json'), 
  JSON.stringify(buildInfo, null, 2)
);
console.log('✅ Created build-info.json with build metadata');

console.log('✅ Post-build script completed successfully!'); 