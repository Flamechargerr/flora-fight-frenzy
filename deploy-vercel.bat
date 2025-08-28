@echo off
echo Setting environment for Vercel deployment...
set DEPLOY_TARGET=vercel

echo Building project for Vercel deployment...
call npm run build

echo Done! Ready for Vercel deployment.
echo Now run: npx vercel --prod