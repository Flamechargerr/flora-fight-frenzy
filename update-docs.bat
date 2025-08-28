@echo off
echo Building project...
call npm run build

echo Cleaning docs directory...
if exist docs (
  del /Q docs\*
) else (
  mkdir docs
)

echo Copying files to docs directory...
xcopy /E /Y dist\* docs\

echo Creating 404.html...
copy docs\index.html docs\404.html

echo Creating CNAME file...
echo flamechargerr.github.io > docs\CNAME

echo Done! Ready for GitHub Pages deployment.