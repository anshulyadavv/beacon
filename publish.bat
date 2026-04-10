@echo off
echo =======================================================
echo Preparing to publish Beacon Version 2.0 to Git...
echo =======================================================

:: Ensure we're up to date
echo 🔄 Pulling latest changes...
git pull origin main

:: Add all files to staging
echo 📦 Staging files...
git add .

:: Commit changes
echo 💾 Committing with Release Version 2.0...
git commit -m "Release Version 2.0 - Professional Terminal Upgrade"

:: Create a git tag for version 2.0
echo 🏷️  Creating git tag v2.0...
git tag -a v2.0 -m "Beacon Terminal Platform Version 2.0"

:: Push main branch
echo 🚀 Pushing code to repository...
git push origin main

:: Push tags to GitHub
echo 🚀 Pushing tags...
git push origin v2.0

echo =======================================================
echo ✅ Successfully published Version 2.0!
echo =======================================================
pause
