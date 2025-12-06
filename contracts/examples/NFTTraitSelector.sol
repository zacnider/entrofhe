// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "../interfaces/IEntropyOracle.sol";

/**
 * @title NFTTraitSelector
 * @notice Example contract for selecting NFT traits using EntropyOracle
 * @dev Demonstrates how to use encrypted entropy for NFT trait selection
 */
contract NFTTraitSelector {
    IEntropyOracle public entropyOracle;
    
    // NFT traits
    string[] public backgrounds = ["Red", "Blue", "Green", "Yellow", "Purple"];
    string[] public accessories = ["Hat", "Glasses", "Necklace", "Watch", "Ring"];
    string[] public expressions = ["Happy", "Sad", "Angry", "Surprised", "Cool"];
    
    // NFT structure
    struct NFT {
        uint256 tokenId;
        uint256 entropyRequestId;
        bool minted;
    }
    
    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => uint256) public requestIdToTokenId;
    uint256 public nextTokenId;
    
    event NFTMintRequested(uint256 indexed tokenId, uint256 indexed requestId);
    event NFTMinted(uint256 indexed tokenId, uint256 indexed requestId);
    
    constructor(address _entropyOracle) {
        require(_entropyOracle != address(0), "Invalid oracle address");
        entropyOracle = IEntropyOracle(_entropyOracle);
    }
    
    /**
     * @notice Request entropy for NFT trait selection
     * @param tag Unique tag for this NFT mint
     * @return tokenId The token ID for this NFT
     * @return requestId The entropy request ID
     * @dev Requires 0.00001 ETH fee for entropy request
     */
    function requestMint(bytes32 tag) external payable returns (uint256 tokenId, uint256 requestId) {
        require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
        
        tokenId = nextTokenId++;
        
        // Request entropy from oracle
        requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        
        // Store NFT request
        nfts[tokenId] = NFT({
            tokenId: tokenId,
            entropyRequestId: requestId,
            minted: false
        });
        
        requestIdToTokenId[requestId] = tokenId;
        
        emit NFTMintRequested(tokenId, requestId);
        
        return (tokenId, requestId);
    }
    
    /**
     * @notice Complete NFT minting (traits selected using entropy)
     * @param tokenId The token ID
     * @dev In a real implementation, you would decrypt entropy and use it to select traits
     *      For this example, we mark it as minted
     */
    function completeMint(uint256 tokenId) external {
        require(nfts[tokenId].tokenId == tokenId, "NFT not found");
        require(!nfts[tokenId].minted, "NFT already minted");
        require(entropyOracle.isRequestFulfilled(nfts[tokenId].entropyRequestId), "Entropy not ready");
        
        // Get encrypted entropy
        // euint64 entropy = entropyOracle.getEncryptedEntropy(nfts[tokenId].entropyRequestId);
        
        // In a real implementation, you would:
        // 1. Decrypt entropy (or use FHE operations)
        // 2. Use entropy to select traits from arrays
        // 3. Store selected traits
        
        // For this example, we just mark as minted
        nfts[tokenId].minted = true;
        
        emit NFTMinted(tokenId, nfts[tokenId].entropyRequestId);
    }
    
    /**
     * @notice Get NFT information
     * @param tokenId The token ID
     * @return tokenId_ The token ID
     * @return entropyRequestId The entropy request ID
     * @return minted Whether NFT is minted
     */
    function getNFT(uint256 tokenId) external view returns (
        uint256 tokenId_,
        uint256 entropyRequestId,
        bool minted
    ) {
        NFT memory nft = nfts[tokenId];
        return (nft.tokenId, nft.entropyRequestId, nft.minted);
    }
    
    /**
     * @notice Get available traits
     * @return backgrounds_ Available background colors
     * @return accessories_ Available accessories
     * @return expressions_ Available expressions
     */
    function getAvailableTraits() external view returns (
        string[] memory backgrounds_,
        string[] memory accessories_,
        string[] memory expressions_
    ) {
        return (backgrounds, accessories, expressions);
    }
}

