// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "./IEntropyOracle.sol";

/**
 * @title EntropyEncryptMultiple
 * @notice Encrypt and store multiple values using EntropyOracle
 * @dev Example demonstrating EntropyOracle integration: encrypting and storing multiple values
 * 
 * This example shows:
 * - How to integrate with EntropyOracle
 * - Encrypting multiple values at once
 * - Storing multiple encrypted values in a mapping
 * - Using entropy to enhance encryption patterns for multiple values
 * - Batch operations on encrypted data
 */
contract EntropyEncryptMultiple is ZamaEthereumConfig {
    // Entropy Oracle interface
    IEntropyOracle public entropyOracle;
    
    // Mapping to store multiple encrypted values by key
    mapping(uint256 => euint64) private encryptedValues;
    
    // Track which keys have been initialized
    mapping(uint256 => bool) public isInitialized;
    
    // Track entropy requests
    mapping(uint256 => bool) public entropyRequests;
    
    // Total number of values stored
    uint256 public totalValues;
    
    event ValueEncrypted(uint256 indexed key, address indexed user);
    event ValuesEncryptedBatch(uint256[] indexed keys, address indexed user);
    event EntropyRequested(uint256 indexed requestId, address indexed caller);
    event ValueEncryptedWithEntropy(uint256 indexed key, uint256 indexed requestId, address indexed user);
    event ValuesEncryptedBatchWithEntropy(uint256[] indexed keys, uint256 indexed requestId, address indexed user);
    
    /**
     * @notice Constructor - sets EntropyOracle address
     * @param _entropyOracle Address of EntropyOracle contract
     */
    constructor(address _entropyOracle) {
        require(_entropyOracle != address(0), "Invalid oracle address");
        entropyOracle = IEntropyOracle(_entropyOracle);
    }
    
    /**
     * @notice Encrypt and store a single value at a specific key
     * @param key Key/index for storing the value
     * @param encryptedInput Encrypted value from user (externalEuint64)
     * @param inputProof Input proof for encrypted value
     * @dev User encrypts value off-chain, sends to contract
     */
    function encryptAndStore(
        uint256 key,
        externalEuint64 encryptedInput,
        bytes calldata inputProof
    ) external {
        // Convert external encrypted value to internal
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        
        // Allow contract to use this encrypted value
        FHE.allowThis(internalValue);
        
        // Store encrypted value
        encryptedValues[key] = internalValue;
        
        if (!isInitialized[key]) {
            isInitialized[key] = true;
            totalValues++;
        }
        
        emit ValueEncrypted(key, msg.sender);
    }
    
    /**
     * @notice Encrypt and store multiple values at once
     * @param keys Array of keys for storing values
     * @param encryptedInputs Array of encrypted values from user
     * @param inputProofs Array of input proofs for encrypted values
     * @dev Batch operation to encrypt and store multiple values
     */
    function encryptAndStoreBatch(
        uint256[] calldata keys,
        externalEuint64[] calldata encryptedInputs,
        bytes[] calldata inputProofs
    ) external {
        require(keys.length == encryptedInputs.length, "Keys and inputs length mismatch");
        require(keys.length == inputProofs.length, "Keys and proofs length mismatch");
        require(keys.length > 0, "Empty arrays");
        
        for (uint256 i = 0; i < keys.length; i++) {
            // Convert external to internal
            euint64 internalValue = FHE.fromExternal(encryptedInputs[i], inputProofs[i]);
            FHE.allowThis(internalValue);
            
            // Store encrypted value
            encryptedValues[keys[i]] = internalValue;
            
            if (!isInitialized[keys[i]]) {
                isInitialized[keys[i]] = true;
                totalValues++;
            }
        }
        
        emit ValuesEncryptedBatch(keys, msg.sender);
    }
    
    /**
     * @notice Request entropy for encryption enhancement
     * @param tag Unique tag for this request
     * @return requestId Request ID from EntropyOracle
     * @dev Requires 0.00001 ETH fee
     */
    function requestEntropy(bytes32 tag) external payable returns (uint256 requestId) {
        require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
        
        requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        entropyRequests[requestId] = true;
        
        emit EntropyRequested(requestId, msg.sender);
        return requestId;
    }
    
    /**
     * @notice Encrypt and store value with entropy enhancement
     * @param key Key/index for storing the value
     * @param encryptedInput Encrypted value from user
     * @param inputProof Input proof for encrypted value
     * @param requestId Request ID from requestEntropy()
     * @dev Combines user-encrypted value with entropy for enhanced encryption
     */
    function encryptAndStoreWithEntropy(
        uint256 key,
        externalEuint64 encryptedInput,
        bytes calldata inputProof,
        uint256 requestId
    ) external {
        require(entropyRequests[requestId], "Invalid request ID");
        require(entropyOracle.isRequestFulfilled(requestId), "Entropy not ready");
        
        // Convert external to internal
        euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
        FHE.allowThis(internalValue);
        
        // Get entropy
        euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
        FHE.allowThis(entropy);
        
        // Combine user value with entropy using XOR
        euint64 enhancedValue = FHE.xor(internalValue, entropy);
        FHE.allowThis(enhancedValue);
        
        // Store enhanced encrypted value
        encryptedValues[key] = enhancedValue;
        
        if (!isInitialized[key]) {
            isInitialized[key] = true;
            totalValues++;
        }
        
        entropyRequests[requestId] = false;
        emit ValueEncryptedWithEntropy(key, requestId, msg.sender);
    }
    
    /**
     * @notice Encrypt and store multiple values with entropy enhancement
     * @param keys Array of keys for storing values
     * @param encryptedInputs Array of encrypted values from user
     * @param inputProofs Array of input proofs for encrypted values
     * @param requestId Request ID from requestEntropy()
     * @dev Batch operation with entropy enhancement
     */
    function encryptAndStoreBatchWithEntropy(
        uint256[] calldata keys,
        externalEuint64[] calldata encryptedInputs,
        bytes[] calldata inputProofs,
        uint256 requestId
    ) external {
        require(entropyRequests[requestId], "Invalid request ID");
        require(entropyOracle.isRequestFulfilled(requestId), "Entropy not ready");
        require(keys.length == encryptedInputs.length, "Keys and inputs length mismatch");
        require(keys.length == inputProofs.length, "Keys and proofs length mismatch");
        require(keys.length > 0, "Empty arrays");
        
        // Get entropy once for all values
        euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
        FHE.allowThis(entropy);
        
        for (uint256 i = 0; i < keys.length; i++) {
            // Convert external to internal
            euint64 internalValue = FHE.fromExternal(encryptedInputs[i], inputProofs[i]);
            FHE.allowThis(internalValue);
            
            // Combine with entropy
            euint64 enhancedValue = FHE.xor(internalValue, entropy);
            FHE.allowThis(enhancedValue);
            
            // Store enhanced encrypted value
            encryptedValues[keys[i]] = enhancedValue;
            
            if (!isInitialized[keys[i]]) {
                isInitialized[keys[i]] = true;
                totalValues++;
            }
        }
        
        entropyRequests[requestId] = false;
        emit ValuesEncryptedBatchWithEntropy(keys, requestId, msg.sender);
    }
    
    /**
     * @notice Get the encrypted value at a specific key
     * @param key Key/index to retrieve
     * @return Encrypted value (euint64)
     * @dev Returns encrypted value - must be decrypted off-chain to see actual value
     */
    function getEncryptedValue(uint256 key) external view returns (euint64) {
        require(isInitialized[key], "Key not initialized");
        return encryptedValues[key];
    }
    
    /**
     * @notice Check if a key is initialized
     * @param key Key to check
     * @return true if initialized, false otherwise
     */
    function isKeyInitialized(uint256 key) external view returns (bool) {
        return isInitialized[key];
    }
    
    /**
     * @notice Get total number of values stored
     * @return Total count of initialized values
     */
    function getTotalValues() external view returns (uint256) {
        return totalValues;
    }
    
    /**
     * @notice Get EntropyOracle address
     */
    function getEntropyOracle() external view returns (address) {
        return address(entropyOracle);
    }
}

