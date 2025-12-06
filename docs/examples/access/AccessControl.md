# AccessControl

Access control with FHE.allow and FHE.allowTransient

## Overview

@title AccessControl
@notice Access control with FHE.allow and FHE.allowTransient
@dev Example demonstrating access control patterns with FHE
@chapter access-control
This example shows:
- FHE.allow: Grant specific user decryption rights
- FHE.allowTransient: Grant temporary access for a single operation
- Access control patterns for encrypted data

@notice Initialize with encrypted value
@param encryptedInput Encrypted value
@param inputProof Input proof

@notice Allow user to decrypt value
@param user Address of user to allow
@dev Uses FHE.allow to grant permanent decryption rights

@notice Perform operation with transient access
@param user Address to grant transient access
@dev Uses FHE.allowTransient for temporary access

@notice Get encrypted value
@return Encrypted value

@notice Check if user is allowed
@param user Address to check
@return True if user is allowed



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title AccessControl
 * @notice Access control with FHE.allow and FHE.allowTransient
 * @dev Example demonstrating access control patterns with FHE
 * @chapter access-control
 * 
 * This example shows:
 * - FHE.allow: Grant specific user decryption rights
 * - FHE.allowTransient: Grant temporary access for a single operation
 * - Access control patterns for encrypted data
 */
contract AccessControl is ZamaEthereumConfig {
    // Encrypted value
    euint64 private encryptedValue;
    
    // Mapping of allowed users
    mapping(address => bool) public allowedUsers;
    
    bool private initialized;
    
    event ValueStored(address indexed user);
    event UserAllowed(address indexed user);
    event UserRevoked(address indexed user);
    event TransientOperation(address indexed user);
    
    /**
     * @notice Initialize with encrypted value
     * @param encryptedInput Encrypted value
     * @param inputProof Input proof
     */
    function initialize(
        externalEuint64 encryptedInput,
        bytes calldata inputProof
    ) external {
        require(!initialized, "Already initialized");
        
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        FHE.allowThis(internalValue);
        
        encryptedValue = internalValue;
        initialized = true;
        
        emit ValueStored(msg.sender);
    }
    
    /**
     * @notice Allow user to decrypt value
     * @param user Address of user to allow
     * @dev Uses FHE.allow to grant permanent decryption rights
     */
    function allowUser(address user) external {
        require(initialized, "Not initialized");
        require(user != address(0), "Invalid user");
        require(!allowedUsers[user], "User already allowed");
        
        // Allow user to decrypt
        FHE.allow(encryptedValue, user);
        allowedUsers[user] = true;
        
        emit UserAllowed(user);
    }
    
    /**
     * @notice Perform operation with transient access
     * @param user Address to grant transient access
     * @dev Uses FHE.allowTransient for temporary access
     */
    function performTransientOperation(address user) external returns (euint64) {
        require(initialized, "Not initialized");
        require(user != address(0), "Invalid user");
        
        // Grant transient access (only for this operation)
        FHE.allowTransient(encryptedValue, user);
        
        // Perform operation (e.g., add 1)
        euint64 one = FHE.asEuint64(1);
        euint64 result = FHE.add(encryptedValue, one);
        
        emit TransientOperation(user);
        
        return result;
    }
    
    /**
     * @notice Get encrypted value
     * @return Encrypted value
     */
    function getEncryptedValue() external view returns (euint64) {
        require(initialized, "Not initialized");
        return encryptedValue;
    }
    
    /**
     * @notice Check if user is allowed
     * @param user Address to check
     * @return True if user is allowed
     */
    function isUserAllowed(address user) external view returns (bool) {
        return allowedUsers[user];
    }
}

```

## Tests

See [test file](../examples/access-control-accesscontrol/test/AccessControl.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**access**

## Chapter

`access`

## Related Examples

- [All access examples](../examples/access/)
