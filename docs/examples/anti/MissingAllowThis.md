# MissingAllowThis

Missing FHE.allowThis() permissions

## Overview

@title MissingAllowThis
@notice Missing FHE.allowThis() permissions
@dev ANTI-PATTERN: Demonstrates common mistake of missing allowThis
@chapter anti-patterns
⚠️ ANTI-PATTERN WARNING:
Common Mistake:
- Forgetting to call FHE.allowThis() before using encrypted values
- Trying to use encrypted values in FHE operations without permission
- Getting "permission denied" errors
What Happens:
- FHE operations will fail
- Contract will revert with permission errors
- Encrypted values cannot be used in FHE operations
Solution:
- Always call FHE.allowThis() after FHE.fromExternal()
- This grants the contract permission to use the encrypted value

❌ ANTI-PATTERN: Missing FHE.allowThis()
@dev This will fail when trying to use value1 in FHE operations

✅ CORRECT: Using FHE.allowThis()
@dev This is the correct way to initialize encrypted values

@notice Add two values (will fail if allowThis was not called)
@return Sum of value1 + value2



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title MissingAllowThis
 * @notice Missing FHE.allowThis() permissions
 * @dev ANTI-PATTERN: Demonstrates common mistake of missing allowThis
 * @chapter anti-patterns
 * 
 * ⚠️ ANTI-PATTERN WARNING:
 * 
 * Common Mistake:
 * - Forgetting to call FHE.allowThis() before using encrypted values
 * - Trying to use encrypted values in FHE operations without permission
 * - Getting "permission denied" errors
 * 
 * What Happens:
 * - FHE operations will fail
 * - Contract will revert with permission errors
 * - Encrypted values cannot be used in FHE operations
 * 
 * Solution:
 * - Always call FHE.allowThis() after FHE.fromExternal()
 * - This grants the contract permission to use the encrypted value
 */
contract MissingAllowThis is ZamaEthereumConfig {
    euint64 private value1;
    euint64 private value2;
    bool private initialized;
    
    /**
     * ❌ ANTI-PATTERN: Missing FHE.allowThis()
     * @dev This will fail when trying to use value1 in FHE operations
     */
    function initializeWrong(
        externalEuint64 encryptedInput1,
        externalEuint64 encryptedInput2,
        bytes calldata inputProof
    ) external {
        require(!initialized, "Already initialized");
        
        // Convert external to internal
        euint64 internalValue1 = FHE.fromExternal(encryptedInput1, inputProof);
        euint64 internalValue2 = FHE.fromExternal(encryptedInput2, inputProof);
        
        // ❌ MISSING: FHE.allowThis(internalValue1);
        // ❌ MISSING: FHE.allowThis(internalValue2);
        
        value1 = internalValue1;
        value2 = internalValue2;
        initialized = true;
        
        // This will FAIL when trying to use value1 or value2 in FHE operations!
    }
    
    /**
     * ✅ CORRECT: Using FHE.allowThis()
     * @dev This is the correct way to initialize encrypted values
     */
    function initializeCorrect(
        externalEuint64 encryptedInput1,
        externalEuint64 encryptedInput2,
        bytes calldata inputProof
    ) external {
        require(!initialized, "Already initialized");
        
        // Convert external to internal
        euint64 internalValue1 = FHE.fromExternal(encryptedInput1, inputProof);
        euint64 internalValue2 = FHE.fromExternal(encryptedInput2, inputProof);
        
        // ✅ CORRECT: Allow contract to use encrypted values
        FHE.allowThis(internalValue1);
        FHE.allowThis(internalValue2);
        
        value1 = internalValue1;
        value2 = internalValue2;
        initialized = true;
    }
    
    /**
     * @notice Add two values (will fail if allowThis was not called)
     * @return Sum of value1 + value2
     */
    function add() external returns (euint64) {
        require(initialized, "Not initialized");
        
        // This will fail if FHE.allowThis() was not called during initialization
        return FHE.add(value1, value2);
    }
}

```

## Tests

See [test file](../examples/anti-patterns-missingallowthis/test/MissingAllowThis.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**anti**

## Chapter

`anti`

## Related Examples

- [All anti examples](../examples/anti/)
