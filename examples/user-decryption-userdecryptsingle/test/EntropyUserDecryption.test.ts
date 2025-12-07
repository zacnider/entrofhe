import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyUserDecryption } from "../types";

/**
 * @title EntropyUserDecryption Tests
 * @notice Comprehensive tests for EntropyUserDecryption contract with EntropyOracle integration
 * @chapter user-decryption
 */
describe("EntropyUserDecryption", function () {
    async function deployContractFixture() {
    const [owner, user1] = await hre.ethers.getSigners();
    
    // Deploy FHEChaosEngine
    const ChaosEngineFactory = await hre.ethers.getContractFactory("FHEChaosEngine");
    const chaosEngine = await ChaosEngineFactory.deploy(owner.address);
    await chaosEngine.waitForDeployment();
    const chaosEngineAddress = await chaosEngine.getAddress();
    
    // Initialize master seed for FHEChaosEngine
    const masterSeedInput = hre.fhevm.createEncryptedInput(chaosEngineAddress, owner.address);
    masterSeedInput.add64(12345);
    const encryptedMasterSeed = await masterSeedInput.encrypt();
    await chaosEngine.initializeMasterSeed(encryptedMasterSeed.handles[0], encryptedMasterSeed.inputProof);
    
    // Deploy EntropyOracle
    const OracleFactory = await hre.ethers.getContractFactory("EntropyOracle");
    const oracle = await OracleFactory.deploy(chaosEngineAddress, owner.address, owner.address);
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    
    // Deploy EntropyUserDecryption
    const ContractFactory = await hre.ethers.getContractFactory("EntropyUserDecryption");
    const contract = await ContractFactory.deploy(oracleAddress) as EntropyUserDecryption;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyUserDecryption");
    
    return { contract, owner, user1, contractAddress, oracleAddress, oracle, chaosEngine };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should have EntropyOracle address set", async function () {
      const { contract, oracleAddress } = await loadFixture(deployContractFixture);
      expect(await contract.getEntropyOracle()).to.equal(oracleAddress);
    });
  });

  describe("Basic Storage and Allow", function () {
    it("Should store and allow user to decrypt", async function () {
      const { contract, contractAddress, owner, user1 } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.storeAndAllow(encryptedInput.handles[0], encryptedInput.inputProof, user1.address);
      
      expect(await contract.isInitialized()).to.be.true;
      expect(await contract.getAllowedUser()).to.equal(user1.address);
    });
  });

  describe("Entropy-Enhanced Storage", function () {
    it("Should request entropy", async function () {
      const { contract, oracle } = await loadFixture(deployContractFixture);
      
      
      
      const tag = hre.ethers.id("test-user-decrypt");
      const fee = await oracle.getFee();
      
      await expect(
        contract.requestEntropy(tag, { value: fee })
      ).to.emit(contract, "EntropyRequested");
    });
  });
});


