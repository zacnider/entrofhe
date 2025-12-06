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
    
    // Deploy FHEChaosEngine
    const ChaosEngineFactory = await hre.ethers.getContractFactory("FHEChaosEngine");
    const chaosEngine = await ChaosEngineFactory.deploy(owner.address);
    await chaosEngine.waitForDeployment();
    const chaosEngineAddress = await chaosEngine.getAddress();
    
    // Initialize master seed
    const masterSeedInput = hre.fhevm.createEncryptedInput(chaosEngineAddress, owner.address);
    masterSeedInput.add64(12345);
    const encryptedMasterSeed = await masterSeedInput.encrypt();
    await chaosEngine.initializeMasterSeed(encryptedMasterSeed.handles[0], encryptedMasterSeed.inputProof);
    
    // Deploy EntropyOracle
    const OracleFactory = await hre.ethers.getContractFactory("EntropyOracle");
    const oracle = await OracleFactory.deploy(chaosEngineAddress, owner.address, owner.address);
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyVestingWallet");
    const contract = await ContractFactory.deploy(oracleAddress) as EntropyVestingWallet;
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyVestingWallet");
    
    return { contract, owner, user1, user2, contractAddress, oracleAddress, oracle, chaosEngine };
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
      const { contract, user1, oracle } = await loadFixture(deployContractsFixture);
      
      const tag = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("vesting"));
      const fee = await oracle.getFee();
      
      await expect(
        contract.connect(user1).requestVestingWithEntropy(tag, { value: fee })
      ).to.emit(contract, "VestingRequested");
    });
  });
});
