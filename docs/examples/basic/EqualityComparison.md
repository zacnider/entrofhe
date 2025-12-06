# EqualityComparison

FHE equality comparison (FHE.eq)

## Overview

@title EqualityComparison
@notice FHE equality comparison (FHE.eq)
@dev Example demonstrating FHE equality comparison operations
@chapter basic
This example shows:
- FHE.eq: Comparing two encrypted values for equality
- Using ebool (encrypted boolean) results
- Conditional logic with encrypted values

@notice Initialize two encrypted values
@param encryptedValue1 First encrypted value
@param encryptedValue2 Second encrypted value
@param inputProof Input proof for encrypted values

@notice Compare two encrypted values for equality
@return result Encrypted boolean (ebool): true if value1 == value2, false otherwise

@notice Check if values are initialized



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EqualityComparison
 * @notice FHE equality comparison (FHE.eq)
 * @dev Example demonstrating FHE equality comparison operations
 * @chapter basic
 * 
 * This example shows:
 * - FHE.eq: Comparing two encrypted values for equality
 * - Using ebool (encrypted boolean) results
 * - Conditional logic with encrypted values
 */
contract EqualityComparison is ZamaEthereumConfig {
    // Encrypted values to compare
    euint64 private value1;
    euint64 private value2;
    
    bool private initialized;
    
    event ValuesInitialized(address indexed initializer);
    event ComparisonPerformed(ebool result);
    
    /**
     * @notice Initialize two encrypted values
     * @param encryptedValue1 First encrypted value
     * @param encryptedValue2 Second encrypted value
     * @param inputProof Input proof for encrypted values
     */
    function initialize(
        externalEuint64 encryptedValue1,
        externalEuint64 encryptedValue2,
        bytes calldata inputProof
    ) external {
        require(!initialized, "Already initialized");
        
        // Convert external to internal
        euint64 internalValue1 = FHE.fromExternal(encryptedValue1, inputProof);
        euint64 internalValue2 = FHE.fromExternal(encryptedValue2, inputProof);
        
        // Allow contract to use
        FHE.allowThis(internalValue1);
        FHE.allowThis(internalValue2);
        
        value1 = internalValue1;
        value2 = internalValue2;
        initialized = true;
        
        emit ValuesInitialized(msg.sender);
    }
    
    /**
     * @notice Compare two encrypted values for equality
     * @return result Encrypted boolean (ebool): true if value1 == value2, false otherwise
     */
    function compare() external returns (ebool result) {
        require(initialized, "Not initialized");
        result = FHE.eq(value1, value2);
        emit ComparisonPerformed(result);
        return result;
    }
    
    /**
     * @notice Check if values are initialized
     */
    function isInitialized() external view returns (bool) {
        return initialized;
    }
}

```

## Tests

See [test file](../examples/basic-equalitycomparison/test/EqualityComparison.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**basic**

## Chapter

`basic`

## Related Examples

- [All basic examples](../examples/basic/)
