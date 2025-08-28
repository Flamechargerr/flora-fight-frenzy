#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Clean up docs directory
echo "Cleaning docs directory..."
rm -rf docs/*

# Copy all built files to docs directory
echo "Copying files to docs directory..."
cp -r dist/* docs/

# Create 404.html if it doesn't exist
if [ ! -f docs/404.html ]; then
  echo "Creating 404.html..."
  cp docs/index.html docs/404.html
fi

# Update paths in HTML files
echo "Updating paths in HTML files..."
sed -i 's|/flora-fight-frenzy/|./|g' docs/index.html
sed -i 's|/flora-fight-frenzy/|./|g' docs/404.html

# Create CNAME file if it doesn't exist
if [ ! -f docs/CNAME ]; then
  echo "Creating CNAME file..."
  echo "flamechargerr.github.io" > docs/CNAME
fi

echo "Done! Ready for GitHub Pages deployment."