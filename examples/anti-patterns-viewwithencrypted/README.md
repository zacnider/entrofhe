# EntropyViewWithEncrypted

View functions with encrypted values and EntropyOracle (ANTI-PATTERN)

## 📋 Overview

This example demonstrates **anti-patterns** in FHEVM with **EntropyOracle integration**:
- View functions cannot return encrypted values
- View functions cannot call EntropyOracle
- FHE operations are state-modifying
- Correct approaches for returning encrypted values

## ⚠️ ANTI-PATTERN WARNING

### Common Mistakes:
1. Trying to return `euint64` from view functions
2. Using FHE operations in view functions
3. Trying to get entropy from EntropyOracle in view functions
4. Expecting encrypted values to work in pure/view contexts

### What Happens:
- Compilation will fail
- Error: "Function cannot be declared as view because this expression (potentially) modifies the state."
- EntropyOracle functions are not view-compatible

### Correct Approach:
- Use regular functions (not view) to return encrypted values
- Or return the encrypted value handle as bytes/string
- Or use events to emit encrypted values

## 💡 Key Concepts

### EntropyOracle Integration
The contract uses EntropyOracle to demonstrate view function limitations:
```solidity
IEntropyOracle entropyOracle;
// ❌ This won't work in view functions:
// euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Wrong Pattern
```solidity
// ❌ This will NOT compile:
function getValue() external view returns (euint64) {
    return encryptedValue; // Error: view functions can't return euint64
}

// ❌ This will NOT compile:
function getEntropyInView(uint256 requestId) external view returns (euint64) {
    return entropyOracle.getEncryptedEntropy(requestId); // Error: not view
}
```

### Correct Pattern
```solidity
// ✅ This works:
function getValue() external returns (euint64) {
    return encryptedValue; // Regular function, not view
}

// ✅ This works:
function requestEntropy(bytes32 tag) external payable returns (uint256) {
    return entropyOracle.requestEntropy{value: msg.value}(tag);
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy examples)

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

**Note**: This example demonstrates what NOT to do with view functions.

## 📖 Usage Example

### Correct Usage

```typescript
// Deploy contract
const contract = await EntropyViewWithEncryptedFactory.deploy(oracleAddress);

// Initialize
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);

// Get value (NOT view, but regular function)
const value = await contract.getValue(); // ✅ Works!

// Request entropy (NOT view)
const tag = ethers.id("test");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestEntropy(tag, { value: fee }); // ✅ Works!
```

## 🔗 Related Examples

- [EntropyMissingAllowThis](../anti-patterns-missingallowthis/) - Missing allowThis
- [Category: anti-patterns](../)

## 📝 License

BSD-3-Clause-Clear
