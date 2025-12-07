#!/bin/bash
# Install dependencies for all examples
# This runs during Vercel build to pre-install dependencies

cd examples
for dir in */; do
  if [ -f "${dir}package.json" ]; then
    echo "Installing dependencies for ${dir}..."
    cd "${dir}"
    npm install --legacy-peer-deps --silent || true
    cd ..
  fi
done

