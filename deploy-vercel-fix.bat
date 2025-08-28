@echo off
REM Script to deploy with MIME type fixes

REM Build the project with Vercel-specific settings
echo Building project for Vercel deployment...
set DEPLOY_TARGET=vercel
call npm run build

REM Deploy to Vercel
echo Deploying to Vercel production...
call vercel --prod

echo Deployment complete! Check your Vercel dashboard for the deployment URL.
echo If you still encounter MIME type issues, you may need to manually create a new project in the Vercel dashboard.
pause