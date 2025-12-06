# EncryptSingle

Encrypt a single value

## Overview

@title EncryptSingle
@notice Encrypt a single value
@dev Example demonstrating how to encrypt and store a single value
@chapter encryption
This example shows:
- Receiving encrypted input from user (externalEuint64)
- Converting external to internal encrypted value
- Storing encrypted value on-chain
- Using FHE.allowThis for contract access

@notice Encrypt and store a single value
@param encryptedInput Encrypted value from user (externalEuint64)
@param inputProof Input proof for encrypted value
@dev User encrypts value off-chain, sends to contract

@notice Update stored encrypted value
@param encryptedInput New encrypted value
@param inputProof Input proof for encrypted value

@notice Get the encrypted value
@return Encrypted value (euint64)
@dev Returns encrypted value - must be decrypted off-chain to see actual value

@notice Check if value is initialized



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptSingle
 * @notice Encrypt a single value
 * @dev Example demonstrating how to encrypt and store a single value
 * @chapter encryption
 * 
 * This example shows:
 * - Receiving encrypted input from user (externalEuint64)
 * - Converting external to internal encrypted value
 * - Storing encrypted value on-chain
 * - Using FHE.allowThis for contract access
 */
contract EncryptSingle is ZamaEthereumConfig {
    // Encrypted value stored on-chain
    euint64 private encryptedValue;
    
    bool private initialized;
    
    event ValueEncrypted(address indexed user);
    event ValueUpdated(address indexed user);
    
    /**
     * @notice Encrypt and store a single value
     * @param encryptedInput Encrypted value from user (externalEuint64)
     * @param inputProof Input proof for encrypted value
     * @dev User encrypts value off-chain, sends to contract
     */
    function encryptAndStore(
        externalEuint64 encryptedInput,
        bytes calldata inputProof
    ) external {
        // Convert external encrypted value to internal
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        
        // Allow contract to use this encrypted value
        FHE.allowThis(internalValue);
        
        // Store encrypted value
        encryptedValue = internalValue;
        initialized = true;
        
        emit ValueEncrypted(msg.sender);
    }
    
    /**
     * @notice Update stored encrypted value
     * @param encryptedInput New encrypted value
     * @param inputProof Input proof for encrypted value
     */
    function updateValue(
        externalEuint64 encryptedInput,
        bytes calldata inputProof
    ) external {
        require(initialized, "Not initialized");
        
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        FHE.allowThis(internalValue);
        
        encryptedValue = internalValue;
        
        emit ValueUpdated(msg.sender);
    }
    
    /**
     * @notice Get the encrypted value
     * @return Encrypted value (euint64)
     * @dev Returns encrypted value - must be decrypted off-chain to see actual value
     */
    function getEncryptedValue() external view returns (euint64) {
        require(initialized, "Not initialized");
        return encryptedValue;
    }
    
    /**
     * @notice Check if value is initialized
     */
    function isInitialized() external view returns (bool) {
        return initialized;
    }
}

```

## Tests

See [test file](../examples/encryption-encryptsingle/test/EncryptSingle.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**encryption**

## Chapter

`encryption`

## Related Examples

- [All encryption examples](../examples/encryption/)
