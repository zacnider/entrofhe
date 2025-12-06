import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyHandleLifecycle } from "../types";

/**
 * @title EntropyHandleLifecycle Tests
 * @notice Comprehensive tests for EntropyHandleLifecycle contract with EntropyOracle integration
 * @chapter handles
 */
describe("EntropyHandleLifecycle", function () {
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
    
    // Deploy EntropyHandleLifecycle
    const ContractFactory = await hre.ethers.getContractFactory("EntropyHandleLifecycle");
    const contract = await ContractFactory.deploy(oracleAddress) as EntropyHandleLifecycle;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyHandleLifecycle");
    
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

  describe("Handle Lifecycle", function () {
    it("Should store handle", async function () {
      const { contract, contractAddress, owner, oracle } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.storeHandle(encryptedInput.handles[0], encryptedInput.inputProof);
      
      expect(await contract.isInitialized()).to.be.true;
    });

    it("Should use handle in FHE operation", async function () {
      const { contract, contractAddress, owner, oracle } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.storeHandle(encryptedInput.handles[0], encryptedInput.inputProof);
      
      const result = await contract.useHandle();
      expect(result).to.not.be.undefined;
    });
  });

  describe("Entropy Handle Lifecycle", function () {
    it("Should request entropy", async function () {
      const { contract, contractAddress, owner, oracle } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.storeHandle(encryptedInput.handles[0], encryptedInput.inputProof);
      
      
      
      const tag = hre.ethers.id("test-handle");
      const fee = await oracle.getFee();
      
      await expect(
        contract.requestEntropy(tag, { value: fee })
      ).to.emit(contract, "EntropyRequested");
    });
  });
});


