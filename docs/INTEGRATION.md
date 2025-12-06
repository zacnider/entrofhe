# Entrofhe Integration Guide

This guide shows you how to integrate Entrofhe into your project.

## 📦 Installation

### 1. Add Interface to Your Project

```solidity
// Copy contracts/interfaces/IEntropyOracle.sol to your project
// or import as npm package (future)
```

### 2. Use in Your Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "./interfaces/IEntropyOracle.sol";

contract MyDApp {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x...); // EntropyOracle address
    
    function useRandomness() external payable {
        // 1. Request entropy (requires 0.00001 ETH fee)
        bytes32 tag = keccak256("my-unique-tag");
        uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag);
        
        // 2. Get encrypted entropy
        euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
        
        // 3. Use with FHE operations
        // Example: combine entropy with other encrypted values
        euint64 result = FHE.add(entropy, someOtherEncryptedValue);
        
        // 4. Implement your business logic
        // ...
    }
}
```

## 🎯 Use Cases

### Use Case 1: Simple Randomness

```solidity
function pickRandomNumber() external payable returns (uint256) {
    bytes32 tag = keccak256(abi.encodePacked("random-number", block.timestamp));
    uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag);
    
    euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
    
    // Use FHE operations to decrypt entropy
    // or use encrypted
    return uint256(requestId); // Simplified example
}
```

### Use Case 2: Lottery/Prize Draw

```solidity
address[] public participants;

function selectWinner() external payable {
    require(participants.length > 0, "No participants");
    
    bytes32 tag = keccak256("lottery-winner");
    uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag);
    
    euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
    
    // Select winner using entropy
    // (Decryption may be required or use FHE operations)
    uint256 winnerIndex = uint256(requestId) % participants.length;
    address winner = participants[winnerIndex];
    
    // Award prize to winner
    // ...
}
```

### Use Case 3: NFT Minting (Random Traits)

```solidity
function mintWithRandomTraits() external payable {
    bytes32 tag = keccak256(abi.encodePacked("nft-traits", msg.sender, block.timestamp));
    uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag);
    
    euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
    
    // Generate random traits using entropy
    // (using FHE operations)
    // ...
}
```

## 💡 Best Practices

### 1. Use Unique Tags

Use a unique tag for each request:

```solidity
bytes32 tag = keccak256(abi.encodePacked(
    "my-feature",
    msg.sender,
    block.timestamp,
    nonce
));
```

### 2. Fee Check

Always ensure you send sufficient fee:

```solidity
require(msg.value >= ENTROPY_ORACLE.getFee(), "Insufficient fee");
uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: msg.value}(tag);
```

### 3. Request Fulfillment Check

Check that request is completed:

```solidity
require(ENTROPY_ORACLE.isRequestFulfilled(requestId), "Request not fulfilled");
euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
```

### 4. Error Handling

```solidity
try ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag) returns (uint256 requestId) {
    // Success
} catch Error(string memory reason) {
    // Handle error
    revert(reason);
}
```

## 🔧 Frontend Integration

### TypeScript/JavaScript

```typescript
import { ethers } from 'ethers';
import { IEntropyOracle } from './types/contracts';

const ENTROPY_ORACLE_ADDRESS = '0x...'; // Deployed address
const FEE_AMOUNT = ethers.parseEther('0.00001'); // 0.00001 ETH

async function requestEntropy(signer: ethers.Signer, tag: string) {
  const oracle = new ethers.Contract(
    ENTROPY_ORACLE_ADDRESS,
    IEntropyOracle.abi,
    signer
  );
  
  // Request entropy
  const tx = await oracle.requestEntropy(tag, { value: FEE_AMOUNT });
  const receipt = await tx.wait();
  
  // Get request ID from event
  const event = receipt.logs.find(
    log => log.topics[0] === ethers.id('EntropyRequested(uint256,address,bytes32,uint256)')
  );
  const requestId = ethers.AbiCoder.defaultAbiCoder().decode(
    ['uint256'],
    event.data
  )[0];
  
  return requestId;
}

async function getEncryptedEntropy(provider: ethers.Provider, requestId: bigint) {
  const oracle = new ethers.Contract(
    ENTROPY_ORACLE_ADDRESS,
    IEntropyOracle.abi,
    provider
  );
  
  // Get encrypted entropy (euint64)
  const entropy = await oracle.getEncryptedEntropy(requestId);
  
  return entropy;
}
```

## 📊 Gas Estimates

- `requestEntropy()`: ~200,000 - 300,000 gas (due to FHE operations)
- `getEncryptedEntropy()`: ~2,100 gas (view function)
- `isRequestFulfilled()`: ~2,100 gas (view function)

## ⚠️ Important Notes

1. **FHEVM Requirement**: Entrofhe only works on Sepolia testnet (for FHEVM support)
2. **Fee**: Send exactly 0.00001 ETH for each request
3. **Encrypted Values**: Entropy is returned encrypted - use with FHE operations
4. **Master Seed**: Master seed must be initialized after deployment

## 🆘 Troubleshooting

### "Insufficient fee" error
- Check fee amount: must be exactly 0.00001 ETH
- Check current fee with `ENTROPY_ORACLE.getFee()`

### "Request not fulfilled" error
- Wait for request to complete
- Check with `isRequestFulfilled()`

### FHE operations error
- Ensure FHEVM is properly initialized
- Check that you're on Sepolia network

## 📚 More Information

- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Example Contracts](./../contracts/examples/)
- [README](./../README.md)

