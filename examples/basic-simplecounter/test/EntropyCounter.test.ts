import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyCounter } from "../types";

/**
 * @title EntropyCounter Tests
 * @notice Comprehensive tests for EntropyCounter contract with EntropyOracle integration
 * @chapter basic
 */
describe("EntropyCounter", function () {
  /**
   * @notice Deploy contracts fixture
   * @dev Deploys FHEChaosEngine, EntropyOracle, and EntropyCounter
   */
  async function deployContractsFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    // Deploy FHEChaosEngine
    const ChaosEngineFactory = await hre.ethers.getContractFactory("FHEChaosEngine");
    const chaosEngine = await ChaosEngineFactory.deploy(owner.address);
    await chaosEngine.waitForDeployment();
    const chaosEngineAddress = await chaosEngine.getAddress();
    
    // Initialize master seed for FHEChaosEngine
    const chaosEngineContractAddress = chaosEngineAddress;
    const masterSeedInput = hre.fhevm.createEncryptedInput(chaosEngineContractAddress, owner.address);
    masterSeedInput.add64(12345); // Use a test seed value
    const encryptedMasterSeed = await masterSeedInput.encrypt();
    await chaosEngine.initializeMasterSeed(encryptedMasterSeed.handles[0], encryptedMasterSeed.inputProof);
    
    // Deploy EntropyOracle
    const OracleFactory = await hre.ethers.getContractFactory("EntropyOracle");
    const oracle = await OracleFactory.deploy(chaosEngineAddress, owner.address, owner.address);
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    
    // Deploy EntropyCounter
    const ContractFactory = await hre.ethers.getContractFactory("EntropyCounter");
    const contract = await ContractFactory.deploy(oracleAddress) as EntropyCounter;
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    
    // Assert coprocessor is initialized
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyCounter");
    
    return { 
      contract, 
      owner, 
      user1, 
      user2, 
      contractAddress, 
      oracleAddress,
      oracle,
      chaosEngine
    };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should not be initialized by default", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.isInitialized()).to.be.false;
    });

    it("Should have EntropyOracle address set", async function () {
      const { contract, oracleAddress } = await loadFixture(deployContractsFixture);
      expect(await contract.getEntropyOracle()).to.equal(oracleAddress);
    });

  });

  describe("Initialization", function () {
    it("Should initialize with encrypted value", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractsFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(0);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      expect(await contract.isInitialized()).to.be.true;
    });

    it("Should not allow double initialization", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractsFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(0);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      await expect(
        contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof)
      ).to.be.revertedWith("Counter already initialized");
    });
  });

  describe("Simple Increment", function () {
    it("Should increment encrypted counter without entropy", async function () {
      const { contract, contractAddress, owner, user1 } = await loadFixture(deployContractsFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(0);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      await expect(contract.connect(user1).increment())
        .to.emit(contract, "CounterIncremented")
        .withArgs(0, user1.address);
      
      const encryptedCounter = await contract.getCounter();
      expect(encryptedCounter).to.not.be.undefined;
    });

    it("Should not allow increment before initialization", async function () {
      const { contract, user1 } = await loadFixture(deployContractsFixture);
      
      await expect(
        contract.connect(user1).increment()
      ).to.be.revertedWith("Counter not initialized");
    });
  });

  describe("Entropy-based Increment", function () {
    it("Should request entropy for increment", async function () {
      const { contract, contractAddress, owner, user1, oracle } = await loadFixture(deployContractsFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(0);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      const tag = hre.ethers.id("test-increment");
      const fee = await oracle.getFee();
      
      await expect(
        contract.connect(user1).requestIncrement(tag, { value: fee })
      ).to.emit(contract, "IncrementRequested");
    });

    it("Should track increment count", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractsFixture);
      
      expect(await contract.getIncrementCount()).to.equal(0);
    });
  });

  describe("View Functions", function () {
    it("Should return encrypted counter value", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractsFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(5);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      const encryptedCounter = await contract.getCounter();
      expect(encryptedCounter).to.not.be.undefined;
    });

    it("Should not return counter before initialization", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      
      await expect(contract.getCounter()).to.be.revertedWith("Counter not initialized");
    });
  });
});

