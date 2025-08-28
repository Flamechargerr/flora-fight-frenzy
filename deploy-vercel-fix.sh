#!/bin/bash
# Script to deploy with MIME type fixes

# Build the project with Vercel-specific settings
echo "Building project for Vercel deployment..."
DEPLOY_TARGET=vercel npm run build

# Deploy to Vercel
echo "Deploying to Vercel production..."
vercel --prod

echo "Deployment complete! Check your Vercel dashboard for the deployment URL."
echo "If you still encounter MIME type issues, you may need to manually create a new project in the Vercel dashboard."