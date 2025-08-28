#!/bin/bash

# Set environment variable for Vercel deployment
export DEPLOY_TARGET=vercel

# Build the project
echo "Building project for Vercel deployment..."
npm run build

echo "Done! Ready for Vercel deployment."
echo "Now run: npx vercel --prod"