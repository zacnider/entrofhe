# ViewWithEncrypted

View functions with encrypted values (not allowed)

## Overview

@title ViewWithEncrypted
@notice View functions with encrypted values (not allowed)
@dev ANTI-PATTERN: This demonstrates what NOT to do
@chapter anti-patterns
⚠️ ANTI-PATTERN WARNING:
View functions cannot return encrypted values (euint64) directly.
FHE operations are considered state-modifying, so they cannot be in view functions.
Common Mistakes:
1. Trying to return euint64 from view functions
2. Using FHE operations in view functions
3. Expecting encrypted values to work in pure/view contexts
Correct Approach:
- Use regular functions (not view) to return encrypted values
- Or return the encrypted value handle as bytes/string
- Or use events to emit encrypted values

@notice Initialize encrypted value
@param encryptedInput Encrypted value
@param inputProof Input proof

❌ ANTI-PATTERN: View function returning encrypted value
@dev This will NOT compile - view functions cannot return euint64
@dev FHE operations are state-modifying, so they can't be in view functions
Error you'll get:
"Function cannot be declared as view because this expression (potentially) modifies the state."

✅ CORRECT: Regular function (not view) to return encrypted value
@return Encrypted value

✅ ALTERNATIVE: Return as bytes (if you need view-like behavior)
@dev You can return the handle as bytes, but this loses FHE capabilities



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ViewWithEncrypted
 * @notice View functions with encrypted values (not allowed)
 * @dev ANTI-PATTERN: This demonstrates what NOT to do
 * @chapter anti-patterns
 * 
 * ⚠️ ANTI-PATTERN WARNING:
 * 
 * View functions cannot return encrypted values (euint64) directly.
 * FHE operations are considered state-modifying, so they cannot be in view functions.
 * 
 * Common Mistakes:
 * 1. Trying to return euint64 from view functions
 * 2. Using FHE operations in view functions
 * 3. Expecting encrypted values to work in pure/view contexts
 * 
 * Correct Approach:
 * - Use regular functions (not view) to return encrypted values
 * - Or return the encrypted value handle as bytes/string
 * - Or use events to emit encrypted values
 */
contract ViewWithEncrypted is ZamaEthereumConfig {
    euint64 private encryptedValue;
    bool private initialized;
    
    /**
     * @notice Initialize encrypted value
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
    }
    
    /**
     * ❌ ANTI-PATTERN: View function returning encrypted value
     * @dev This will NOT compile - view functions cannot return euint64
     * @dev FHE operations are state-modifying, so they can't be in view functions
     * 
     * Error you'll get:
     * "Function cannot be declared as view because this expression (potentially) modifies the state."
     */
    // function getValue() external view returns (euint64) {
    //     return encryptedValue; // ❌ This won't work!
    // }
    
    /**
     * ✅ CORRECT: Regular function (not view) to return encrypted value
     * @return Encrypted value
     */
    function getValue() external returns (euint64) {
        require(initialized, "Not initialized");
        return encryptedValue; // ✅ This works!
    }
    
    /**
     * ✅ ALTERNATIVE: Return as bytes (if you need view-like behavior)
     * @dev You can return the handle as bytes, but this loses FHE capabilities
     */
    // function getValueAsBytes() external view returns (bytes memory) {
    //     // Convert handle to bytes (loses FHE capabilities)
    //     // This is a workaround, but not recommended
    // }
}

```

## Tests

See [test file](../examples/anti-patterns-viewwithencrypted/test/ViewWithEncrypted.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**anti**

## Chapter

`anti`

## Related Examples

- [All anti examples](../examples/anti/)
