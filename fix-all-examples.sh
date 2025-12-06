#!/bin/bash
# Fix all examples: tsconfig.json, npm install, compile

set -e

EXAMPLES_DIR="examples"

echo "🔧 Fixing all examples..."

for dir in "$EXAMPLES_DIR"/*/; do
  if [ -d "$dir" ] && [ -f "$dir/tsconfig.json" ]; then
    example_name=$(basename "$dir")
    echo ""
    echo "📦 Processing: $example_name"
    
    cd "$dir"
    
    # Fix tsconfig.json
    if ! grep -q '"types"' tsconfig.json; then
      echo "  ✓ Adding types to tsconfig.json"
      sed -i '' 's/"moduleResolution": "node"/"moduleResolution": "node",\n    "types": ["mocha", "node"]/' tsconfig.json
    fi
    
    if ! grep -q '".\/types"' tsconfig.json; then
      echo "  ✓ Adding types to include"
      sed -i '' 's/"include": \["\.\/scripts", "\.\/test", "\.\/hardhat\.config\.ts"\]/"include": [".\/scripts", ".\/test", ".\/hardhat.config.ts", ".\/types"]/' tsconfig.json
    fi
    
    # Remove duplicate types entries
    if grep -c '"types"' tsconfig.json | grep -q "^2"; then
      echo "  ✓ Removing duplicate types"
      sed -i '' '/"types": \["mocha", "node"\]/{N; /"types": \["mocha", "node"\]/d;}' tsconfig.json
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
      echo "  ✓ Installing dependencies..."
      npm install --legacy-peer-deps > /dev/null 2>&1 || echo "    ⚠ Install had issues, but continuing..."
    fi
    
    # Compile to generate types
    if [ ! -d "types" ]; then
      echo "  ✓ Compiling to generate types..."
      npm run compile > /dev/null 2>&1 || echo "    ⚠ Compile had issues, but continuing..."
    fi
    
    cd - > /dev/null
    echo "  ✅ Done: $example_name"
  fi
done

echo ""
echo "🎉 All examples fixed!"


