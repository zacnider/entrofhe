# UserDecryptSingle

User decrypt single value using FHE.allow

## Overview

@title UserDecryptSingle
@notice User decrypt single value using FHE.allow
@dev Example demonstrating user-specific decryption with FHE.allow
@chapter user-decryption
This example shows:
- Storing encrypted value
- Using FHE.allow to grant specific user decryption rights
- Only the allowed user can decrypt the value

@notice Store encrypted value and allow specific user to decrypt
@param encryptedInput Encrypted value from user
@param inputProof Input proof for encrypted value
@param user Address of user who can decrypt

@notice Get encrypted value (only allowed user can decrypt off-chain)
@return Encrypted value (euint64)
@dev User must use FHEVM SDK to decrypt this value

@notice Get allowed user address
@return Address of user who can decrypt

@notice Check if initialized



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title UserDecryptSingle
 * @notice User decrypt single value using FHE.allow
 * @dev Example demonstrating user-specific decryption with FHE.allow
 * @chapter user-decryption
 * 
 * This example shows:
 * - Storing encrypted value
 * - Using FHE.allow to grant specific user decryption rights
 * - Only the allowed user can decrypt the value
 */
contract UserDecryptSingle is ZamaEthereumConfig {
    // Encrypted value
    euint64 private encryptedValue;
    
    // User who can decrypt
    address private allowedUser;
    
    bool private initialized;
    
    event ValueStored(address indexed user);
    event UserAllowed(address indexed user);
    
    /**
     * @notice Store encrypted value and allow specific user to decrypt
     * @param encryptedInput Encrypted value from user
     * @param inputProof Input proof for encrypted value
     * @param user Address of user who can decrypt
     */
    function storeAndAllow(
        externalEuint64 encryptedInput,
        bytes calldata inputProof,
        address user
    ) external {
        require(!initialized, "Already initialized");
        require(user != address(0), "Invalid user address");
        
        // Convert external to internal
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        
        // Allow contract to use
        FHE.allowThis(internalValue);
        
        // Allow specific user to decrypt
        FHE.allow(internalValue, user);
        
        encryptedValue = internalValue;
        allowedUser = user;
        initialized = true;
        
        emit ValueStored(msg.sender);
        emit UserAllowed(user);
    }
    
    /**
     * @notice Get encrypted value (only allowed user can decrypt off-chain)
     * @return Encrypted value (euint64)
     * @dev User must use FHEVM SDK to decrypt this value
     */
    function getEncryptedValue() external view returns (euint64) {
        require(initialized, "Not initialized");
        return encryptedValue;
    }
    
    /**
     * @notice Get allowed user address
     * @return Address of user who can decrypt
     */
    function getAllowedUser() external view returns (address) {
        return allowedUser;
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

See [test file](../examples/user-decryption-userdecryptsingle/test/UserDecryptSingle.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**user**

## Chapter

`user`

## Related Examples

- [All user examples](../examples/user/)
