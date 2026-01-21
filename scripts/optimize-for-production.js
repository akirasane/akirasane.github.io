#!/usr/bin/env node

/**
 * Production Optimization Script
 * 
 * This script performs the following optimizations:
 * 1. Removes console.log statements from JavaScript files
 * 2. Creates minified versions of JavaScript files
 * 3. Optimizes images (converts to WebP, compresses)
 * 4. Generates cache headers configuration
 * 
 * Usage: node scripts/optimize-for-production.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Configuration
const config = {
  jsFiles: [
    'components/**/*.js',
    'utils/**/*.js'
  ],
  imageFiles: [
    'Images/**/*.{png,jpg,jpeg}'
  ],
  excludePatterns: [
    'node_modules',
    'tests',
    '*.test.js',
    '*.config.js'
  ]
};

/**
 * Remove console.log statements from JavaScript code
 */
function removeConsoleLogs(code) {
  // Remove console.log statements (simple regex approach)
  // Matches: console.log(...), console.warn(...), console.error(...), etc.
  return code.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '');
}

/**
 * Simple minification (removes comments and extra whitespace)
 */
function minifyJS(code) {
  // Remove single-line comments
  code = code.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove extra whitespace
  code = code.replace(/\s+/g, ' ');
  
  // Remove whitespace around operators
  code = code.replace(/\s*([{}();,:])\s*/g, '$1');
  
  return code.trim();
}

/**
 * Process JavaScript files
 */
async function processJavaScriptFiles() {
  console.log('📦 Processing JavaScript files...\n');
  
  const componentsDir = path.join(rootDir, 'components');
  const utilsDir = path.join(rootDir, 'utils');
  
  const dirs = [componentsDir, utilsDir];
  let processedCount = 0;
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.includes('.min.'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Remove console.log statements
      let optimized = removeConsoleLogs(content);
      
      // Create minified version
      const minified = minifyJS(optimized);
      const minFilePath = filePath.replace('.js', '.min.js');
      
      fs.writeFileSync(minFilePath, minified, 'utf8');
      
      const originalSize = Buffer.byteLength(content, 'utf8');
      const minifiedSize = Buffer.byteLength(minified, 'utf8');
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ ${path.relative(rootDir, filePath)}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Minified: ${(minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`   Savings: ${savings}%\n`);
      
      processedCount++;
    }
  }
  
  console.log(`✨ Processed ${processedCount} JavaScript files\n`);
}

/**
 * Optimize images (convert to WebP and compress)
 */
async function optimizeImages() {
  console.log('🖼️  Optimizing images...\n');
  
  const imagesDir = path.join(rootDir, 'Images');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('⚠️  Images directory not found\n');
    return;
  }
  
  const files = fs.readdirSync(imagesDir).filter(f => 
    /\.(png|jpg|jpeg)$/i.test(f) && !f.includes('.webp')
  );
  
  let processedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    try {
      // Convert to WebP
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(webpPath);
      
      const originalSize = fs.statSync(filePath).size;
      const webpSize = fs.statSync(webpPath).size;
      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ ${file} → ${path.basename(webpPath)}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   WebP: ${(webpSize / 1024).toFixed(2)} KB`);
      console.log(`   Savings: ${savings}%\n`);
      
      processedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`✨ Optimized ${processedCount} images\n`);
}

/**
 * Generate cache headers configuration
 */
function generateCacheHeaders() {
  console.log('📝 Generating cache headers configuration...\n');
  
  const cacheConfig = {
    description: 'Cache Headers Configuration for Production',
    headers: {
      '*.html': {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      },
      '*.js': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '*.css': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '*.{jpg,jpeg,png,gif,webp,svg}': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '*.{woff,woff2,ttf,eot}': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '*.json': {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    },
    notes: [
      'HTML files: No cache (always fetch fresh)',
      'Static assets (JS, CSS, images, fonts): Cache for 1 year with immutable flag',
      'JSON data files: No cache (always fetch fresh)',
      'Use versioning or cache busting for updated assets'
    ]
  };
  
  // Generate _headers file for Netlify
  const netlifyHeaders = `# Cache Headers Configuration

# HTML files - no cache
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# JavaScript files - cache for 1 year
/*.js
  Cache-Control: public, max-age=31536000, immutable

# CSS files - cache for 1 year
/*.css
  Cache-Control: public, max-age=31536000, immutable

# Images - cache for 1 year
/*.jpg
  Cache-Control: public, max-age=31536000, immutable
/*.jpeg
  Cache-Control: public, max-age=31536000, immutable
/*.png
  Cache-Control: public, max-age=31536000, immutable
/*.gif
  Cache-Control: public, max-age=31536000, immutable
/*.webp
  Cache-Control: public, max-age=31536000, immutable
/*.svg
  Cache-Control: public, max-age=31536000, immutable

# Fonts - cache for 1 year
/*.woff
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
/*.ttf
  Cache-Control: public, max-age=31536000, immutable
/*.eot
  Cache-Control: public, max-age=31536000, immutable

# JSON data files - no cache
/*.json
  Cache-Control: public, max-age=0, must-revalidate
`;
  
  // Generate .htaccess file for Apache
  const htaccess = `# Cache Headers Configuration

<IfModule mod_headers.c>
  # HTML files - no cache
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>

  # JavaScript and CSS - cache for 1 year
  <FilesMatch "\\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # Images - cache for 1 year
  <FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # Fonts - cache for 1 year
  <FilesMatch "\\.(woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # JSON data files - no cache
  <FilesMatch "\\.(json)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
`;
  
  // Write configuration files
  fs.writeFileSync(path.join(rootDir, '_headers'), netlifyHeaders, 'utf8');
  fs.writeFileSync(path.join(rootDir, '.htaccess'), htaccess, 'utf8');
  fs.writeFileSync(
    path.join(rootDir, 'cache-config.json'),
    JSON.stringify(cacheConfig, null, 2),
    'utf8'
  );
  
  console.log('✅ Generated _headers (Netlify)');
  console.log('✅ Generated .htaccess (Apache)');
  console.log('✅ Generated cache-config.json\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting production optimization...\n');
  console.log('='.repeat(60) + '\n');
  
  try {
    await processJavaScriptFiles();
    await optimizeImages();
    generateCacheHeaders();
    
    console.log('='.repeat(60));
    console.log('✨ Production optimization complete!\n');
    console.log('Next steps:');
    console.log('1. Update index.html to use .min.js files');
    console.log('2. Update image references to use .webp files');
    console.log('3. Deploy _headers or .htaccess with your site');
    console.log('4. Test the optimized site locally');
    console.log('5. Run Lighthouse audit to verify improvements\n');
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run the script
main();
