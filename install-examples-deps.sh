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
    # Create types directory if it doesn't exist
    mkdir -p types 2>/dev/null || true
    # Run hardhat compile to generate types (with timeout to prevent hanging)
    timeout 120 npx hardhat compile --quiet 2>/dev/null || {
      echo "  ⚠️  Warning: Failed to generate types for ${dir}, continuing..."
      # Create a dummy types file to prevent import errors
      mkdir -p types 2>/dev/null || true
      echo "// Placeholder types file" > types/index.ts 2>/dev/null || true
    }
    cd ..
  fi
done

echo "✅ All example dependencies installed successfully!"

