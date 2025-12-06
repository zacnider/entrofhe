#!/bin/bash
# Fix all test files to use correct MockFhevmInstance import and usage

find examples -name "*.test.ts" -type f | while read file; do
  # Replace import
  sed -i '' 's/import { createFhevmInstance, getPublicKey } from "@fhevm\/mock-utils";/import { MockFhevmInstance } from "@fhevm\/mock-utils";/g' "$file"
  sed -i '' 's/import { createFhevmInstance } from "@fhevm\/mock-utils";/import { MockFhevmInstance } from "@fhevm\/mock-utils";/g' "$file"
  
  # Replace usage - need provider
  sed -i '' 's/const instance = await createFhevmInstance({/const provider = ethers.provider;\n    const instance = await MockFhevmInstance.create({/g' "$file"
  sed -i '' 's/const instance = new MockFhevmInstance({/const provider = ethers.provider;\n    const instance = await MockFhevmInstance.create({/g' "$file"
  
  # Add provider to config
  sed -i '' '/chainId: 31337,/a\
      provider: provider,' "$file"
done

echo "Fixed all test files"


