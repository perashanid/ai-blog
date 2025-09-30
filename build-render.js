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

// Check if client/public/index.html exists
const indexHtmlPath = path.join(clientDir, 'public', 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('index.html not found at:', indexHtmlPath);
  process.exit(1);
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