#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Render build process...');

// Get the current working directory
const rootDir = process.cwd();
const clientDir = path.join(rootDir, 'client');

console.log('Root directory:', rootDir);
console.log('Client directory:', clientDir);

// Check if client directory exists
if (!fs.existsSync(clientDir)) {
  console.error('Client directory not found!');
  process.exit(1);
}

// Ensure public directory and index.html exist
const publicDir = path.join(clientDir, 'public');
const indexHtmlPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(indexHtmlPath)) {
  console.log('Creating index.html...');
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="AI Blog Website" />
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <title>AI Blog Website</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`;
  fs.writeFileSync(indexHtmlPath, indexHtmlContent);
}

// Create manifest.json if it doesn't exist
const manifestPath = path.join(publicDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.log('Creating manifest.json...');
  const manifestContent = {
    "short_name": "AI Blog",
    "name": "AI Blog Website",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));
}

console.log('Found index.html at:', indexHtmlPath);

try {
  // Change to client directory and install dependencies
  console.log('Installing client dependencies...');
  process.chdir(clientDir);
  
  // Try npm ci first, fallback to npm install if it fails
  try {
    execSync('npm ci', { stdio: 'inherit' });
  } catch (ciError) {
    console.log('npm ci failed, trying npm install...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Build the React app
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, CI: 'false' } });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}