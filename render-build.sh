#!/bin/bash

echo "Starting Render build process..."
echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Check if client directory exists
if [ ! -d "client" ]; then
    echo "Error: client directory not found!"
    exit 1
fi

# Navigate to client directory
echo "Navigating to client directory..."
cd client

echo "Current directory: $(pwd)"
echo "Listing client contents:"
ls -la

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "Error: public directory not found!"
    exit 1
fi

# Check if index.html exists
if [ ! -f "public/index.html" ]; then
    echo "Error: index.html not found in public directory!"
    exit 1
fi

echo "Found index.html at: $(pwd)/public/index.html"

# Install client dependencies
echo "Installing client dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

echo "Build completed successfully!"