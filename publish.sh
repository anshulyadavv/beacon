#!/bin/bash

echo "🚀 Preparing to publish Beacon Version 2.0..."

# Ensure we're up to date
git pull origin main

# Add all files to staging
git add .

# Commit changes
git commit -m "🔖 Release Version 2.0 - Professional Terminal Upgrade"

# Create a git tag for version 2.0
git tag -a v2.0 -m "Beacon Terminal Platform Version 2.0"

# Push main branch
git push origin main

# Push tags to GitHub
git push origin v2.0

echo "✅ Successfully published Version 2.0 to Git!"
