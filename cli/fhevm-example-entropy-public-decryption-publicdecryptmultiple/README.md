# Public Decrypt Multiple

EntropyPublicDecryptMultiple

## 🎯 Overview

This example demonstrates public decrypt multiple using **EntropyOracle** - a production-ready FHE-based entropy and randomness infrastructure.

## ✨ Features

- ✅ **EntropyOracle Integration**: Uses encrypted randomness from EntropyOracle
- ✅ **Zama FHEVM**: Built with Zama's FHEVM framework
- ✅ **Fully Encrypted**: All operations performed on encrypted data
- ✅ **Production Ready**: Deployed on Sepolia testnet

## 🚀 Quick Start

### Installation

```bash
npm install --legacy-peer-deps
```

### Testing

```bash
npm test
```

### Deployment

```bash
npm run deploy:sepolia
```

## 🔗 EntropyOracle

**EntropyOracle** is deployed on Sepolia testnet:

- **Address**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- **Network**: Sepolia (Chain ID: 11155111)
- **Fee per Request**: 0.00001 ether

### Integration

This contract uses EntropyOracle for encrypted randomness:

```solidity
import "./interfaces/IEntropyOracle.sol";

contract EntropyPublicDecryptMultiple is ZamaEthereumConfig {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
    
    // Use entropy in your FHE operations...
}
```

## 📚 Learn More

- [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- [EntropyOracle Integration Guide](../../docs/INTEGRATION.md)
- [FHEVM Example Hub](../../README.md)

## 📝 License

BSD-3-Clause-Clear
