# SimpleCounter

Simple counter using FHE encryption

## Overview

@title SimpleCounter
@notice Simple counter using FHE encryption
@dev Example demonstrating basic FHE operations: storing and incrementing encrypted values
@chapter basic
This example shows:
- How to store encrypted values (euint64)
- How to perform FHE operations (FHE.add)
- How to allow contract to use encrypted values (FHE.allowThis)

@notice Initialize counter with an encrypted value
@param encryptedValue Encrypted initial value (euint64)
@param inputProof Input proof for encrypted value
@dev Must be called before incrementing. Can only be called once.

@notice Increment the encrypted counter
@dev Uses FHE.add to increment the encrypted value by 1
@dev Requires counter to be initialized

@notice Check if counter is initialized
@return True if counter has been initialized

@notice Get the encrypted counter value
@return Encrypted counter value (euint64)
@dev Returns encrypted value - must be decrypted off-chain to see actual value



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title SimpleCounter
 * @notice Simple counter using FHE encryption
 * @dev Example demonstrating basic FHE operations: storing and incrementing encrypted values
 * @chapter basic
 * 
 * This example shows:
 * - How to store encrypted values (euint64)
 * - How to perform FHE operations (FHE.add)
 * - How to allow contract to use encrypted values (FHE.allowThis)
 */
contract SimpleCounter is ZamaEthereumConfig {
    // Encrypted counter value
    euint64 private counter;
    
    // Counter initialized flag
    bool private initialized;
    
    event CounterInitialized(address indexed initializer);
    event CounterIncremented(address indexed caller);
    
    /**
     * @notice Initialize counter with an encrypted value
     * @param encryptedValue Encrypted initial value (euint64)
     * @param inputProof Input proof for encrypted value
     * @dev Must be called before incrementing. Can only be called once.
     */
    function initialize(externalEuint64 encryptedValue, bytes calldata inputProof) external {
        require(!initialized, "Counter already initialized");
        
        // Convert external encrypted value to internal
        euint64 internalValue = FHE.fromExternal(encryptedValue, inputProof);
        
        // Allow contract to use this encrypted value
        FHE.allowThis(internalValue);
        
        // Store encrypted counter
        counter = internalValue;
        initialized = true;
        
        emit CounterInitialized(msg.sender);
    }
    
    /**
     * @notice Increment the encrypted counter
     * @dev Uses FHE.add to increment the encrypted value by 1
     * @dev Requires counter to be initialized
     */
    function increment() external {
        require(initialized, "Counter not initialized");
        
        // Increment encrypted counter using FHE.add
        // Note: We can't use literal 1 directly, so we use FHE.asEuint64(1)
        euint64 one = FHE.asEuint64(1);
        counter = FHE.add(counter, one);
        
        emit CounterIncremented(msg.sender);
    }
    
    /**
     * @notice Check if counter is initialized
     * @return True if counter has been initialized
     */
    function isInitialized() external view returns (bool) {
        return initialized;
    }
    
    /**
     * @notice Get the encrypted counter value
     * @return Encrypted counter value (euint64)
     * @dev Returns encrypted value - must be decrypted off-chain to see actual value
     */
    function getCounter() external view returns (euint64) {
        require(initialized, "Counter not initialized");
        return counter;
    }
}

```

## Tests

See [test file](../examples/basic-simplecounter/test/SimpleCounter.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**basic**

## Chapter

`basic`

## Related Examples

- [All basic examples](../examples/basic/)
