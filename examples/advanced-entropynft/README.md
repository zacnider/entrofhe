# EntropyNFT

ERC721 NFT with trait selection using entropy oracle

## 📋 Overview

This example demonstrates **advanced** concepts in FHEVM:
- ERC721 NFT implementation
- Trait selection using encrypted entropy
- IPFS metadata storage
- Real-world NFT minting pattern

## 💡 Key Concepts

### Entropy-Based Traits
NFT traits are selected using encrypted entropy from an oracle:
- Traits remain private until minting
- Fair and unpredictable selection
- Verifiable randomness

### ERC721 Standard
Full ERC721 implementation with:
- Token minting
- Metadata storage (IPFS)
- URI management

### IPFS Integration
NFT metadata and images stored on IPFS for decentralization.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- Deployed EntropyOracle contract
- IPFS access (Pinata or similar)

### Installation

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm test
```

**Note**: Full tests require a deployed EntropyOracle contract. The test file includes placeholder tests.

## 📖 Usage Example

```typescript
// Deploy with EntropyOracle address
const oracleAddress = "0x..."; // Your EntropyOracle address
const contract = await EntropyNFTFactory.deploy(oracleAddress);

// Request mint (uses entropy for trait selection)
const tag = ethers.id("mint-request-1");
await contract.requestMint(tag, { value: fee });

// Complete mint (after entropy is available)
const tokenURI = "ipfs://..."; // IPFS metadata URI
await contract.completeMint(tag, tokenURI);

// Get NFT details
const owner = await contract.ownerOf(tokenId);
const uri = await contract.tokenURI(tokenId);
```

## 🔗 Related Examples

- [SimpleLottery](../advanced-simplelottery/) - Lottery using entropy
- [RandomNumberGenerator](../advanced-randomnumbergenerator/) - Random number generation
- [Category: advanced](../)

## 📝 License

BSD-3-Clause-Clear
