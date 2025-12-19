// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Example Contract
/// @notice Base template contract for FHEVM examples
/// @dev This contract serves as a template. Replace with your own contract logic.
contract Example is ZamaEthereumConfig {
    // TODO: Add your contract state variables here
    
    /// @notice Example function
    /// @param inputEuint64 the encrypted input value
    /// @param inputProof the input proof
    function exampleFunction(externalEuint64 inputEuint64, bytes calldata inputProof) external {
        euint64 encryptedValue = FHE.fromExternal(inputEuint64, inputProof);
        
        // TODO: Add your contract logic here
        
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);
    }
}

