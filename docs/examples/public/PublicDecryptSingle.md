# PublicDecryptSingle

Public decrypt single value using makePubliclyDecryptable

## Overview

@title PublicDecryptSingle
@notice Public decrypt single value using makePubliclyDecryptable
@dev Example demonstrating public decryption with makePubliclyDecryptable
@chapter public-decryption
This example shows:
- Storing encrypted value
- Using FHE.makePubliclyDecryptable to allow anyone to decrypt
- Public decryption pattern (use with caution for privacy)

@notice Store encrypted value and make it publicly decryptable
@param encryptedInput Encrypted value from user
@param inputProof Input proof for encrypted value
@dev Makes value decryptable by anyone (use with caution)

@notice Get encrypted value (publicly decryptable)
@return Encrypted value (euint64) - anyone can decrypt this
@dev Anyone can use FHEVM SDK publicDecrypt to decrypt this value

@notice Check if initialized



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PublicDecryptSingle
 * @notice Public decrypt single value using makePubliclyDecryptable
 * @dev Example demonstrating public decryption with makePubliclyDecryptable
 * @chapter public-decryption
 * 
 * This example shows:
 * - Storing encrypted value
 * - Using FHE.makePubliclyDecryptable to allow anyone to decrypt
 * - Public decryption pattern (use with caution for privacy)
 */
contract PublicDecryptSingle is ZamaEthereumConfig {
    // Encrypted value (publicly decryptable)
    euint64 private encryptedValue;
    
    bool private initialized;
    
    event ValueStored(address indexed user);
    event ValueMadePubliclyDecryptable();
    
    /**
     * @notice Store encrypted value and make it publicly decryptable
     * @param encryptedInput Encrypted value from user
     * @param inputProof Input proof for encrypted value
     * @dev Makes value decryptable by anyone (use with caution)
     */
    function storeAndMakePublic(
        externalEuint64 encryptedInput,
        bytes calldata inputProof
    ) external {
        require(!initialized, "Already initialized");
        
        // Convert external to internal
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        
        // Allow contract to use
        FHE.allowThis(internalValue);
        
        // Make publicly decryptable (anyone can decrypt)
        encryptedValue = FHE.makePubliclyDecryptable(internalValue);
        initialized = true;
        
        emit ValueStored(msg.sender);
        emit ValueMadePubliclyDecryptable();
    }
    
    /**
     * @notice Get encrypted value (publicly decryptable)
     * @return Encrypted value (euint64) - anyone can decrypt this
     * @dev Anyone can use FHEVM SDK publicDecrypt to decrypt this value
     */
    function getEncryptedValue() external view returns (euint64) {
        require(initialized, "Not initialized");
        return encryptedValue;
    }
    
    /**
     * @notice Check if initialized
     */
    function isInitialized() external view returns (bool) {
        return initialized;
    }
}

```

## Tests

See [test file](../examples/public-decryption-publicdecryptsingle/test/PublicDecryptSingle.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**public**

## Chapter

`public`

## Related Examples

- [All public examples](../examples/public/)
