import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyVestingWallet } from "../types";

/**
 * @title EntropyVestingWallet Tests
 * @notice Comprehensive tests for vesting wallet with EntropyOracle integration
 * @chapter openzeppelin
 */
describe("EntropyVestingWallet", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyVestingWallet");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as EntropyVestingWallet;
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyVestingWallet");
    
    return { contract, owner, user1, user2, contractAddress, oracleAddress: ORACLE_ADDRESS };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should have EntropyOracle address set", async function () {
      const { contract, oracleAddress } = await loadFixture(deployContractsFixture);
      expect(await contract.getEntropyOracle()).to.equal(oracleAddress);
    });
  });

  describe("Vesting with Entropy", function () {
    it("Should request entropy for vesting", async function () {
      const { contract, user1 } = await loadFixture(deployContractsFixture);
      
      const tag = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("vesting"));
      const fee = hre.ethers.parseEther("0.00001");
      
      await expect(
        contract.connect(user1).requestVestingWithEntropy(tag, { value: fee })
      ).to.emit(contract, "VestingRequested");
    });
  });
});
