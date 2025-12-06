// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, euint256, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "./IEntropyOracle.sol";

/**
 * @title EntropyERC7984Token
 * @notice Basic ERC7984 confidential token implementation with EntropyOracle integration
 * @dev Example demonstrating ERC7984 confidential token standard with encrypted balances
 * @chapter openzeppelin
 * 
 * This example shows:
 * - ERC7984 confidential token standard implementation
 * - Encrypted balances using euint256
 * - Transfer functions with encrypted amounts
 * - Mint/burn operations
 * - EntropyOracle integration for random token operations
 */
contract EntropyERC7984Token is ZamaEthereumConfig {
    IEntropyOracle public entropyOracle;
    
    // Encrypted balances: address => encrypted balance
    mapping(address => euint256) private encryptedBalances;
    
    // Total supply (encrypted)
    euint256 private totalSupplyEncrypted;
    
    // Track entropy requests
    mapping(uint256 => address) public mintRequests;
    uint256 public mintRequestCount;
    
    // Token metadata
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    
    event Transfer(address indexed from, address indexed to, bytes encryptedAmount);
    event MintRequested(address indexed to, uint256 indexed requestId);
    event Minted(address indexed to, uint256 indexed requestId);
    event Burned(address indexed from, bytes encryptedAmount);
    
    /**
     * @notice Constructor - initializes token with EntropyOracle
     * @param _entropyOracle Address of EntropyOracle contract
     * @param _name Token name
     * @param _symbol Token symbol
     */
    constructor(
        address _entropyOracle,
        string memory _name,
        string memory _symbol
    ) {
        require(_entropyOracle != address(0), "Invalid oracle address");
        entropyOracle = IEntropyOracle(_entropyOracle);
        name = _name;
        symbol = _symbol;
    }
    
    /**
     * @notice Request entropy for minting tokens with random amounts
     * @param tag Unique tag for entropy request
     * @return requestId Entropy request ID
     * @dev User must pay oracle fee
     */
    function requestMintWithEntropy(bytes32 tag) external payable returns (uint256 requestId) {
        require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
        
        requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        mintRequests[requestId] = msg.sender;
        mintRequestCount++;
        
        emit MintRequested(msg.sender, requestId);
        return requestId;
    }
    
    /**
     * @notice Mint tokens using entropy (encrypted random amount)
     * @param requestId Entropy request ID
     * @param encryptedAmount Encrypted amount to mint (can be combined with entropy)
     * @param inputProof Input proof for encrypted amount
     * @dev Uses entropy to add randomness to minted amount
     */
    function mintWithEntropy(
        uint256 requestId,
        externalEuint256 calldata encryptedAmount,
        bytes calldata inputProof
    ) external {
        require(entropyOracle.isRequestFulfilled(requestId), "Entropy not ready");
        require(mintRequests[requestId] == msg.sender, "Invalid request");
        
        // Get encrypted entropy
        euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
        
        // Convert entropy to euint256 and combine with amount
        euint256 entropy256 = FHE.asEuint256(entropy);
        euint256 amount = FHE.asEuint256(encryptedAmount, inputProof);
        
        // Add entropy to amount (for randomness)
        euint256 mintAmount = FHE.add(amount, entropy256);
        
        // Mint tokens
        encryptedBalances[msg.sender] = FHE.add(encryptedBalances[msg.sender], mintAmount);
        totalSupplyEncrypted = FHE.add(totalSupplyEncrypted, mintAmount);
        
        // Clear request
        delete mintRequests[requestId];
        
        emit Minted(msg.sender, requestId);
    }
    
    /**
     * @notice Transfer encrypted tokens
     * @param to Recipient address
     * @param encryptedAmount Encrypted amount to transfer
     * @param inputProof Input proof for encrypted amount
     * @dev Transfers encrypted tokens between addresses
     */
    function transfer(
        address to,
        externalEuint256 calldata encryptedAmount,
        bytes calldata inputProof
    ) external returns (bool) {
        require(to != address(0), "Transfer to zero address");
        
        euint256 amount = FHE.asEuint256(encryptedAmount, inputProof);
        
        // Check balance (encrypted comparison)
        euint256 senderBalance = encryptedBalances[msg.sender];
        require(FHE.le(amount, senderBalance), "Insufficient balance");
        
        // Transfer
        encryptedBalances[msg.sender] = FHE.sub(senderBalance, amount);
        encryptedBalances[to] = FHE.add(encryptedBalances[to], amount);
        
        emit Transfer(msg.sender, to, abi.encode(encryptedAmount));
        return true;
    }
    
    /**
     * @notice Get encrypted balance of an address
     * @param account Address to query
     * @return Encrypted balance (euint256)
     * @dev Returns encrypted balance - cannot be decrypted on-chain
     */
    function balanceOf(address account) external view returns (euint256) {
        return encryptedBalances[account];
    }
    
    /**
     * @notice Get encrypted total supply
     * @return Encrypted total supply (euint256)
     */
    function totalSupply() external view returns (euint256) {
        return totalSupplyEncrypted;
    }
    
    /**
     * @notice Get EntropyOracle address
     * @return EntropyOracle contract address
     */
    function getEntropyOracle() external view returns (address) {
        return address(entropyOracle);
    }
    
    /**
     * @notice Burn encrypted tokens
     * @param encryptedAmount Encrypted amount to burn
     * @param inputProof Input proof for encrypted amount
     * @dev Burns tokens from caller's balance
     */
    function burn(
        externalEuint256 calldata encryptedAmount,
        bytes calldata inputProof
    ) external {
        euint256 amount = FHE.asEuint256(encryptedAmount, inputProof);
        euint256 senderBalance = encryptedBalances[msg.sender];
        
        require(FHE.le(amount, senderBalance), "Insufficient balance");
        
        encryptedBalances[msg.sender] = FHE.sub(senderBalance, amount);
        totalSupplyEncrypted = FHE.sub(totalSupplyEncrypted, amount);
        
        emit Burned(msg.sender, abi.encode(encryptedAmount));
    }
}
