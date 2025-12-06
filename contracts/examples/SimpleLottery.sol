// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "../interfaces/IEntropyOracle.sol";

/**
 * @title SimpleLottery
 * @notice Example contract showing how to use EntropyOracle
 * @dev This is a simple example - developers can use this as a template
 */
contract SimpleLottery {
    IEntropyOracle public entropyOracle;
    
    // Lottery state
    address[] public participants;
    mapping(uint256 => mapping(address => bool)) public hasParticipated; // Round-based participation
    uint256 public winningRequestId;
    address public winner;
    bool public lotteryComplete;
    uint256 public lotteryRound; // Track lottery rounds
    
    event LotteryStarted(uint256 indexed round);
    event ParticipantAdded(address indexed participant, uint256 indexed round);
    event WinnerSelected(address indexed winner, uint256 indexed requestId, uint256 indexed round);
    event LotteryReset(uint256 indexed newRound);
    
    constructor(address _entropyOracle) {
        require(_entropyOracle != address(0), "Invalid oracle address");
        entropyOracle = IEntropyOracle(_entropyOracle);
        lotteryRound = 1;
        emit LotteryStarted(lotteryRound);
    }
    
    /**
     * @notice Enter lottery
     */
    function enter() external {
        require(!lotteryComplete, "Lottery already complete");
        require(!hasParticipated[lotteryRound][msg.sender], "Already participated in this round");
        
        participants.push(msg.sender);
        hasParticipated[lotteryRound][msg.sender] = true;
        
        emit ParticipantAdded(msg.sender, lotteryRound);
    }
    
    /**
     * @notice Select winner using entropy oracle
     * @dev Requires 0.00001 ETH fee for entropy request
     */
    function selectWinner() external payable {
        require(!lotteryComplete, "Lottery already complete");
        require(participants.length > 0, "No participants");
        
        // Request entropy
        bytes32 tag = keccak256("lottery-winner-selection");
        uint256 requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        winningRequestId = requestId;
        
        // Get encrypted entropy
        // euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
        
        // Use entropy to select winner
        // Note: In a real implementation, you'd need to decrypt or use FHE operations
        // For this example, we'll use a simplified approach
        // In practice, you'd decrypt the entropy and use it to select winner
        
        // Simplified: Use request ID modulo participants length
        // In real implementation, decrypt entropy first
        uint256 winnerIndex = requestId % participants.length;
        winner = participants[winnerIndex];
        lotteryComplete = true;
        
        emit WinnerSelected(winner, requestId, lotteryRound);
    }
    
    /**
     * @notice Get lottery status
     */
    function getStatus() external view returns (
        uint256 participantCount,
        bool complete,
        address currentWinner
    ) {
        return (participants.length, lotteryComplete, winner);
    }
    
    /**
     * @notice Reset lottery to start a new round
     * @dev Clears participants and allows new entries
     */
    function resetLottery() external {
        require(lotteryComplete, "Lottery must be complete before reset");
        
        // Clear participants array
        delete participants;
        
        // Reset state for new round
        lotteryComplete = false;
        winner = address(0);
        winningRequestId = 0;
        lotteryRound++;
        
        // Clear hasParticipated mapping for all previous participants
        // Note: We can't iterate over mapping, so we'll clear it when users try to enter again
        // The enter() function will check hasParticipated, and if lottery was reset,
        // users can enter again (we'll need to track this differently)
        
        emit LotteryReset(lotteryRound);
        emit LotteryStarted(lotteryRound);
    }
    
}

