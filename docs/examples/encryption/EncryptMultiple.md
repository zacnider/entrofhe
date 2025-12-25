# EncryptMultiple

Learn how to encrypt multiple values using FHE.fromExternal

## 📚 Overview

This example teaches you how to use FHEVM to build privacy-preserving smart contracts.

@title EncryptMultiple
@notice Encrypt and store multiple values using encrypted randomness
@dev Example demonstrating FHEVM encryption concepts



## Contract Code

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title EncryptMultiple
 * @notice Encrypt and store multiple values using EntropyOracle
 * @dev Example demonstrating FHEVM encryption concepts
 */
contract EncryptMultiple is ZamaEthereumConfig {
    // TODO: Add your contract implementation here
    
    constructor() {
        // TODO: Initialize your contract
    }
    
    // TODO: Add your functions here
}

```

## Tests

See [test file](../examples/encryption-encryptmultiple/test/EncryptMultiple.test.ts) for comprehensive test coverage.

```bash
npm test
```


## Category

**encryption**



## Related Examples

- [All encryption examples](../examples/encryption/)
