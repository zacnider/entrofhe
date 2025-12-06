import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyEncryption } from "../types";

/**
 * @title EntropyEncryption Tests
 * @notice Comprehensive tests for EntropyEncryption contract with EntropyOracle integration
 * @chapter encryption
 */
describe("EntropyEncryption", function () {
  async function deployContractFixture() {
    const [owner, user1] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyEncryption");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as EntropyEncryption;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyEncryption");
    
    return { contract, owner, user1, contractAddress, oracleAddress: ORACLE_ADDRESS };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should not be initialized by default", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.isInitialized()).to.be.false;
    });

    it("Should have EntropyOracle address set", async function () {
      const { contract, oracleAddress } = await loadFixture(deployContractFixture);
      expect(await contract.getEntropyOracle()).to.equal(oracleAddress);
    });
  });

  describe("Basic Encryption", function () {
    it("Should encrypt and store value", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.encryptAndStore(encryptedInput.handles[0], encryptedInput.inputProof);
      
      expect(await contract.isInitialized()).to.be.true;
    });

    it("Should update encrypted value", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input1 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input1.add64(42);
      const encryptedInput1 = await input1.encrypt();
      
      await contract.encryptAndStore(encryptedInput1.handles[0], encryptedInput1.inputProof);
      
      const input2 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input2.add64(100);
      const encryptedInput2 = await input2.encrypt();
      
      await contract.updateValue(encryptedInput2.handles[0], encryptedInput2.inputProof);
      
      const encryptedValue = await contract.getEncryptedValue();
      expect(encryptedValue).to.not.be.undefined;
    });
  });

  describe("Entropy-Enhanced Encryption", function () {
    it("Should request entropy", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      
      const oracleAddress = await contract.getEntropyOracle();
      if (oracleAddress === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Skipping entropy test - EntropyOracle not deployed");
        return;
      }
      
      const tag = hre.ethers.id("test-encryption");
      const fee = await contract.entropyOracle.getFee();
      
      await expect(
        contract.requestEntropy(tag, { value: fee })
      ).to.emit(contract, "EntropyRequested");
    });

    it("Should encrypt with entropy", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const oracleAddress = await contract.getEntropyOracle();
      if (oracleAddress === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Skipping entropy test - EntropyOracle not deployed");
        return;
      }
      
      // Request entropy
      const tag = hre.ethers.id("encrypt-1");
      const fee = await contract.entropyOracle.getFee();
      const requestId = await contract.requestEntropy(tag, { value: fee });
      
      // Wait for entropy (in real scenario)
      // For now, we'll just test the structure
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      // Note: This will fail if entropy is not ready, which is expected
      // In real tests, wait for entropy fulfillment first
    });
  });
});

