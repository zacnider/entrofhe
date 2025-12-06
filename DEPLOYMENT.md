# Deployment Information

## Sepolia Testnet Deployment

### Contracts

#### FHEChaosEngine (v8 - Privacy Enhanced)
- **Address**: `0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020`
- **Etherscan**: https://sepolia.etherscan.io/address/0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020#code
- **Deployer**: `0xa2cD33E6E81595FbE8CEf825ABc1550416829e8F`
- **Gas Used**: 675,563
- **Status**: ✅ Deployed & Verified, needs master seed initialization
- **Privacy Features**:
  - ✅ Master seed NOT `makePubliclyDecryptable` - remains private
  - ✅ Entropy only decryptable by consumer via `FHE.allow(entropy, consumer)`
  - ✅ No public decryption - full privacy protection

#### FHEChaosEngine (v7 - Fixed currentState allowThis issue)
- **Address**: `0x66561a3e849ABEd61cAE6c9e5614D7444a3ad674`
- **Etherscan**: https://sepolia.etherscan.io/address/0x66561a3e849ABEd61cAE6c9e5614D7444a3ad674#code
- **Status**: ⚠️ Deprecated (replaced by v8 with privacy enhancements)

#### FHEChaosEngine (v6 - Fixed currentState decryptable issue)
- **Address**: `0xB88d2E7b57F21d6F6d8773f2Eb96C83D59F3AaEA`
- **Etherscan**: https://sepolia.etherscan.io/address/0xB88d2E7b57F21d6F6d8773f2Eb96C83D59F3AaEA#code
- **Status**: ⚠️ Deprecated (replaced by v7)

#### FHEChaosEngine (v5 - Fixed requestCounter synchronization)
- **Address**: `0x95fC949e0E25691015bC7dD39a661971e93Bc961`
- **Etherscan**: https://sepolia.etherscan.io/address/0x95fC949e0E25691015bC7dD39a661971e93Bc961#code
- **Status**: ⚠️ Deprecated (replaced by v6)

#### FHEChaosEngine (v4 - Further Optimized LogisticMap)
- **Address**: `0x55fC0cd011c7c7Ca2E70E3292159CaCc8b8b79d9`
- **Etherscan**: https://sepolia.etherscan.io/address/0x55fC0cd011c7c7Ca2E70E3292159CaCc8b8b79d9#code
- **Status**: ⚠️ Deprecated (replaced by v5)

#### FHEChaosEngine (v3 - Optimized LogisticMap)
- **Address**: `0xeC55f82A28188Cae0163Ff908De441011940F54A`
- **Status**: ⚠️ Deprecated (replaced by v4)

#### FHEChaosEngine (v2 - Fixed LogisticMap)
- **Address**: `0x30F14d6A1d97C610cCaC9d01cdC045D9610DDD18`
- **Status**: ⚠️ Deprecated (replaced by v3)

#### FHEChaosEngine (v1 - Old, has LogisticMap issue)
- **Address**: `0xa9d4b303235a643D3Df61a4d7C8Ca2A4d098d311`
- **Etherscan**: https://sepolia.etherscan.io/address/0xa9d4b303235a643D3Df61a4d7C8Ca2A4d098d311#code
- **Status**: ⚠️ Deprecated (LogisticMap underflow issue)

#### EntropyOracle (v3 - Privacy Enhanced with Hashed Events)
- **Address**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- **Etherscan**: https://sepolia.etherscan.io/address/0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361#code
- **Deployer**: `0xa2cD33E6E81595FbE8CEf825ABc1550416829e8F`
- **Gas Used**: 619,843
- **Chaos Engine**: `0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020` (FHEChaosEngine v8)
- **Fee Recipient**: `0xa2cD33E6E81595FbE8CEf825ABc1550416829e8F`
- **Fee Amount**: 0.00001 ETH (10000000000000 wei)
- **Privacy Features**:
  - ✅ Events use `hashedConsumer` (bytes32) instead of plain address
  - ✅ Events use `hashedTag` (bytes32) instead of plain tag
  - ✅ No sensitive data exposed in events

#### EntropyOracle (v2 - Updated to FHEChaosEngine v7)
- **Address**: `0xE9F3c52442fA87221d23E924BcaCF13e6fCcbA03`
- **Etherscan**: https://sepolia.etherscan.io/address/0xE9F3c52442fA87221d23E924BcaCF13e6fCcbA03#code
- **Status**: ⚠️ Deprecated (replaced by v3 with privacy enhancements)

#### EntropyOracle (v1)
- **Address**: `0xd70fA04F7FB32f00c73558f1ACD3066f04f98786`
- **Etherscan**: https://sepolia.etherscan.io/address/0xd70fA04F7FB32f00c73558f1ACD3066f04f98786#code
- **Status**: ⚠️ Deprecated (replaced by v2)

#### Example Contracts (Live on Frontend - Updated to EntropyOracle v3)

##### SimpleLottery
- **Address**: `0x92B9520EBf1bdF43784c3dbcAD57CB4bc8A84544`
- **Etherscan**: https://sepolia.etherscan.io/address/0x92B9520EBf1bdF43784c3dbcAD57CB4bc8A84544#code
- **Status**: ✅ Deployed & Live (uses EntropyOracle v3 with privacy enhancements)
- **Description**: Simple lottery contract for fair winner selection using entropy
- **EntropyOracle**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361` (v3)
- **Features**: Round-based lottery with reset functionality

##### RandomNumberGenerator
- **Address**: `0x571A1A4cA7Ca5c439E8898251d7D730a4042a463`
- **Etherscan**: https://sepolia.etherscan.io/address/0x571A1A4cA7Ca5c439E8898251d7D730a4042a463#code
- **Status**: ✅ Deployed & Live (uses EntropyOracle v3 with privacy enhancements)
- **Description**: Random number generator using encrypted entropy
- **EntropyOracle**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361` (v3)

##### NFTTraitSelector
- **Address**: `0x32Be0B1Df231982BB9CB7428653431E32fab0D39`
- **Etherscan**: https://sepolia.etherscan.io/address/0x32Be0B1Df231982BB9CB7428653431E32fab0D39#code
- **Status**: ✅ Deployed & Live (uses EntropyOracle v3 with privacy enhancements)
- **Description**: NFT trait selector using entropy for random trait generation
- **EntropyOracle**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361` (v3)

##### EntropyNFT (Real ERC721 NFT)
- **Address**: `0xeEcda3b643b9153e7d4D7686E0774e6d5Ad323b7`
- **Etherscan**: https://sepolia.etherscan.io/address/0xeEcda3b643b9153e7d4D7686E0774e6d5Ad323b7#code
- **Status**: ✅ Deployed & Live (uses EntropyOracle v3 with privacy enhancements)
- **Description**: Real ERC721 NFT contract with IPFS metadata, trait selection, and unlimited supply
- **Features**: 
  - ERC721 standard compliance
  - Trait selection using encrypted entropy
  - IPFS metadata storage via Pinata
  - Unlimited supply
- **EntropyOracle**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361` (v3)

### Network
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111

### Frontend Configuration

Add these to your `frontend/.env`:

```env
REACT_APP_ENTROPY_ORACLE_ADDRESS=0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361
REACT_APP_CHAOS_ENGINE_ADDRESS=0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020
REACT_APP_SIMPLE_LOTTERY_ADDRESS=0x92B9520EBf1bdF43784c3dbcAD57CB4bc8A84544
REACT_APP_RANDOM_NUMBER_GENERATOR_ADDRESS=0x571A1A4cA7Ca5c439E8898251d7D730a4042a463
REACT_APP_NFT_TRAIT_SELECTOR_ADDRESS=0x32Be0B1Df231982BB9CB7428653431E32fab0D39
REACT_APP_ENTROPY_NFT_ADDRESS=0xeEcda3b643b9153e7d4D7686E0774e6d5Ad323b7
```

**Note**: The example contracts are already deployed and live on the frontend `/examples` page. Users can interact with them directly without deploying their own contracts.

### Next Steps

1. **Initialize Master Seed**: 
   - Use FHEVM to encrypt a seed value
   - Call `initializeMasterSeed()` on FHEChaosEngine contract
   - This is a one-time operation (owner only)

2. **Test Entropy Request**:
   - Connect wallet to Sepolia
   - Call `requestEntropy(bytes32 tag)` on EntropyOracle
   - Send exactly 0.00001 ETH as fee

3. **Frontend Setup**:
   - Copy ABI files to `frontend/public/abis/`
   - Configure environment variables
   - Start frontend: `cd frontend && npm install && npm start`

