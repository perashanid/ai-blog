#!/bin/bash

echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Navigate to client directory and install dependencies
echo "Installing client dependencies..."
cd client
npm install

# Build the React app
echo "Building React app..."
npm run build

# Go back to root
cd ..

echo "Build completed successfully!"