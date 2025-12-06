import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SimpleLottery } from "../types";

/**
 * @title SimpleLottery Tests
 * @notice Comprehensive tests for SimpleLottery contract
 * @chapter advanced
 */
describe("SimpleLottery", function () {
  async function deployContractFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    // Use a valid non-zero address for testing (contract requires non-zero address)
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x1111111111111111111111111111111111111111";
    
    const ContractFactory = await hre.ethers.getContractFactory("SimpleLottery");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS);
    await contract.waitForDeployment();
    
    // Note: SimpleLottery doesn't use FHE directly, only EntropyOracle
    // So we don't need to assert coprocessor initialization
    
    return { contract, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  // TODO: Add comprehensive test cases for lottery functionality
  // Note: These tests require a deployed EntropyOracle contract
  describe("Functionality", function () {
    it("Should have correct initial state", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      const status = await contract.getStatus();
      expect(status[0]).to.equal(0); // participantCount
      expect(status[1]).to.be.false; // complete
    });
  });
});
