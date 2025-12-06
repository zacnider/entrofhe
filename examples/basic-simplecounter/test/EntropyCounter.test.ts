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
   * @dev Deploys both EntropyOracle (mock) and EntropyCounter
   */
  async function deployContractsFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    // Deploy EntropyOracle (we'll use a mock or the actual deployed one)
    // For testing, we can use a mock or deploy the actual oracle
    // For now, we'll use a placeholder address - in real tests, deploy actual oracle
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyCounter");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as EntropyCounter;
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    
    // Assert coprocessor is initialized
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyCounter");
    
    return { contract, owner, user1, user2, contractAddress, oracleAddress: ORACLE_ADDRESS };
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
      const { contract, contractAddress, owner, user1 } = await loadFixture(deployContractsFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(0);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      // Note: This test requires a deployed EntropyOracle
      // In a real scenario, you would deploy EntropyOracle first
      // For now, we'll skip this test if oracle is not available
      const oracleAddress = await contract.getEntropyOracle();
      if (oracleAddress === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Skipping entropy test - EntropyOracle not deployed");
        return;
      }
      
      const tag = hre.ethers.id("test-increment");
      const fee = await contract.entropyOracle.getFee();
      
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

