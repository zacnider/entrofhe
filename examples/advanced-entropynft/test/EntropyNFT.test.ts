import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyNFT } from "../types";

/**
 * @title EntropyNFT Tests
 * @notice Comprehensive tests for EntropyNFT contract
 * @chapter advanced
 */
describe("EntropyNFT", function () {
  async function deployContractFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    // Use a valid non-zero address for testing (contract requires non-zero address)
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x1111111111111111111111111111111111111111";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyNFT");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS, owner.address);
    await contract.waitForDeployment();
    
    // Note: EntropyNFT doesn't use FHE directly, only EntropyOracle
    // So we don't need to assert coprocessor initialization
    
    return { contract, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  // TODO: Add comprehensive test cases for NFT minting with entropy
  // Note: These tests require a deployed EntropyOracle contract
  describe("Functionality", function () {
    it("Should have correct initial state", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      // TODO: Add test implementation for initial state
    });
  });
});
