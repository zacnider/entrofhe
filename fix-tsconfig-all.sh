#!/bin/bash
# Fix all tsconfig.json files in examples

for dir in examples/*/; do
  if [ -f "$dir/tsconfig.json" ]; then
    echo "Fixing $dir"
    # Remove duplicate "types" entries
    sed -i '' '/"types": \["mocha", "node"\]/d' "$dir/tsconfig.json"
    # Add types if not present
    if ! grep -q '"types"' "$dir/tsconfig.json"; then
      sed -i '' 's/"moduleResolution": "node"/"moduleResolution": "node",\n    "types": ["mocha", "node"]/' "$dir/tsconfig.json"
    fi
    # Add types to include if not present
    if ! grep -q '".\/types"' "$dir/tsconfig.json"; then
      sed -i '' 's/"include": \["\.\/scripts", "\.\/test", "\.\/hardhat\.config\.ts"\]/"include": [".\/scripts", ".\/test", ".\/hardhat.config.ts", ".\/types"]/' "$dir/tsconfig.json"
    fi
  fi
done
