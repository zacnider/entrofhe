#!/bin/bash
# Install dependencies for all examples
# This runs during Vercel build to pre-install dependencies
# This ensures fast runtime performance for users

set -e  # Exit on error

echo "📦 Installing dependencies for all examples..."

cd examples

# Count total examples
total=$(find . -maxdepth 1 -type d -name "*-*" | wc -l | tr -d ' ')
current=0

for dir in */; do
  if [ -f "${dir}package.json" ]; then
    current=$((current + 1))
    echo "[$current/$total] Installing dependencies for ${dir}..."
    cd "${dir}"
    npm install --legacy-peer-deps --silent || {
      echo "⚠️  Warning: Failed to install dependencies for ${dir}, continuing..."
      cd ..
      continue
    }
    # Generate TypeScript types (skip if it fails, not critical for build)
    echo "  Generating TypeScript types..."
    npx hardhat compile --quiet 2>/dev/null || {
      echo "  ⚠️  Warning: Failed to generate types for ${dir}, continuing..."
    }
    cd ..
  fi
done

echo "✅ All example dependencies installed successfully!"

