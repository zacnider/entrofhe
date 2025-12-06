# Arithmetic

FHE arithmetic operations (add, sub, mul)

## Overview

@title Arithmetic
@notice FHE arithmetic operations (add, sub, mul)
@dev Example demonstrating FHE arithmetic: addition, subtraction, multiplication
@chapter basic
This example shows:
- FHE.add: Adding two encrypted values
- FHE.sub: Subtracting encrypted values
- FHE.mul: Multiplying encrypted values

@notice Initialize two encrypted values
@param encryptedValue1 First encrypted value
@param encryptedValue2 Second encrypted value
@param inputProof Input proof for encrypted values

@notice Add two encrypted values
@return result Encrypted sum of value1 + value2

@notice Subtract value2 from value1
@return result Encrypted difference (value1 - value2)

@notice Multiply two encrypted values
@return result Encrypted product of value1 * value2

@notice Check if values are initialized



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Arithmetic
 * @notice FHE arithmetic operations (add, sub, mul)
 * @dev Example demonstrating FHE arithmetic: addition, subtraction, multiplication
 * @chapter basic
 * 
 * This example shows:
 * - FHE.add: Adding two encrypted values
 * - FHE.sub: Subtracting encrypted values
 * - FHE.mul: Multiplying encrypted values
 */
contract Arithmetic is ZamaEthereumConfig {
    // Encrypted values for arithmetic operations
    euint64 private value1;
    euint64 private value2;
    
    bool private initialized;
    
    event ValuesInitialized(address indexed initializer);
    event AdditionPerformed(euint64 result);
    event SubtractionPerformed(euint64 result);
    event MultiplicationPerformed(euint64 result);
    
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
     * @notice Add two encrypted values
     * @return result Encrypted sum of value1 + value2
     */
    function add() external returns (euint64 result) {
        require(initialized, "Not initialized");
        result = FHE.add(value1, value2);
        emit AdditionPerformed(result);
        return result;
    }
    
    /**
     * @notice Subtract value2 from value1
     * @return result Encrypted difference (value1 - value2)
     */
    function subtract() external returns (euint64 result) {
        require(initialized, "Not initialized");
        result = FHE.sub(value1, value2);
        emit SubtractionPerformed(result);
        return result;
    }
    
    /**
     * @notice Multiply two encrypted values
     * @return result Encrypted product of value1 * value2
     */
    function multiply() external returns (euint64 result) {
        require(initialized, "Not initialized");
        result = FHE.mul(value1, value2);
        emit MultiplicationPerformed(result);
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

See [test file](../examples/basic-arithmetic/test/Arithmetic.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**basic**

## Chapter

`basic`

## Related Examples

- [All basic examples](../examples/basic/)
