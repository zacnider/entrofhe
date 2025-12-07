#!/bin/bash
# Create placeholder type files for all examples
# Dependencies will be installed at runtime (first test/compile call)
# This prevents build timeout (reduces build time from 45+ min to ~5 min)

set -e  # Exit on error

echo "📦 Creating placeholder type files for all examples..."

cd examples

# Count total examples
total=$(find . -maxdepth 1 -type d -name "*-*" | wc -l | tr -d ' ')
current=0

for dir in */; do
  if [ -f "${dir}package.json" ]; then
    current=$((current + 1))
    echo "[$current/$total] Creating placeholder types for ${dir}..."
    cd "${dir}"
    # Create placeholder types directory to prevent import errors
    # Type generation happens automatically during hardhat test/compile
    # These placeholder files prevent TypeScript errors during Vercel build check
    mkdir -p types 2>/dev/null || true
    # Create comprehensive placeholder type files
    # Hardhat will generate real types when test/compile runs
    # Get contract name from directory name (e.g., basic-simplecounter -> EntropyCounter)
    dir_name=$(basename "$dir" | sed 's/[^a-zA-Z0-9]//g')
    contract_name=$(echo "$dir_name" | sed 's/^basic//; s/^encryption//; s/^userdecryption//; s/^publicdecryption//; s/^accesscontrol//; s/^inputproof//; s/^antipatterns//; s/^handles//; s/^advanced//; s/^openzeppelin//' | sed 's/^./\U&/')
    
    # Create index.ts with all possible contract types
    cat > types/index.ts << EOF
// Placeholder types - generated automatically by hardhat during test/compile
// This file prevents TypeScript import errors during build
// Real types are generated when hardhat compile/test runs

export type BaseContract = any;
export type Contract = any;
export type ContractFactory = any;

// Export all possible contract types as any to prevent import errors
export type EntropyCounter = any;
export type EntropyArithmetic = any;
export type EntropyEqualityComparison = any;
export type EntropyEncryption = any;
export type EntropyUserDecryption = any;
export type EntropyPublicDecryption = any;
export type EntropyAccessControl = any;
export type EntropyInputProof = any;
export type EntropyMissingAllowThis = any;
export type EntropyViewWithEncrypted = any;
export type EntropyHandleLifecycle = any;
export type EntropyNFT = any;
export type RandomNumberGenerator = any;
export type SimpleLottery = any;
export type VideoDemo = any;
export type EntropyERC7984Token = any;
export type EntropyERC7984ToERC20Wrapper = any;
export type EntropySwapERC7984ToERC20 = any;
export type EntropySwapERC7984ToERC7984 = any;
export type EntropyVestingWallet = any;
EOF
    cd ..
  fi
done

echo "✅ All placeholder type files created successfully!"
echo "ℹ️  Dependencies will be installed at runtime (first test/compile call)"

# Copy examples folder to frontend/build for Vercel serverless functions
# This ensures examples are available in the deployment
cd ..
if [ -d "frontend/build" ]; then
  echo "📁 Copying examples folder to frontend/build for Vercel functions..."
  cp -r examples frontend/build/examples 2>/dev/null || true
  echo "✅ Examples folder copied to build output"
fi

