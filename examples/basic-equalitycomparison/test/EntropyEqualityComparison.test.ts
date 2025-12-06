import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyEqualityComparison } from "../types";

/**
 * @title EntropyEqualityComparison Tests
 * @notice Comprehensive tests for EntropyEqualityComparison contract with EntropyOracle integration
 * @chapter basic
 */
describe("EntropyEqualityComparison", function () {
  async function deployContractFixture() {
    const [owner, user1] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyEqualityComparison");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as EntropyEqualityComparison;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyEqualityComparison");
    
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

  describe("Initialization", function () {
    it("Should initialize with two encrypted values", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input1 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input1.add64(5);
      const encryptedInput1 = await input1.encrypt();
      
      const input2 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input2.add64(5);
      const encryptedInput2 = await input2.encrypt();
      
      await contract.initialize(
        encryptedInput1.handles[0],
        encryptedInput2.handles[0],
        encryptedInput1.inputProof
      );
      
      expect(await contract.isInitialized()).to.be.true;
    });
  });

  describe("Basic Comparison", function () {
    it("Should perform equality comparison", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input1 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input1.add64(5);
      const encryptedInput1 = await input1.encrypt();
      
      const input2 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input2.add64(5);
      const encryptedInput2 = await input2.encrypt();
      
      await contract.initialize(
        encryptedInput1.handles[0],
        encryptedInput2.handles[0],
        encryptedInput1.inputProof
      );
      
      const result = await contract.compare();
      expect(result).to.not.be.undefined;
    });
  });

  describe("Entropy-based Comparison", function () {
    it("Should request entropy", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input1 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input1.add64(5);
      const encryptedInput1 = await input1.encrypt();
      
      const input2 = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input2.add64(5);
      const encryptedInput2 = await input2.encrypt();
      
      await contract.initialize(
        encryptedInput1.handles[0],
        encryptedInput2.handles[0],
        encryptedInput1.inputProof
      );
      
      const oracleAddress = await contract.getEntropyOracle();
      if (oracleAddress === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Skipping entropy test - EntropyOracle not deployed");
        return;
      }
      
      const tag = hre.ethers.id("test-comparison");
      const fee = await contract.entropyOracle.getFee();
      
      await expect(
        contract.requestEntropy(tag, { value: fee })
      ).to.emit(contract, "EntropyRequested");
    });
  });
});

