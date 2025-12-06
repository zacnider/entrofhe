import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyPublicDecryption } from "../types";

/**
 * @title EntropyPublicDecryption Tests
 * @notice Comprehensive tests for EntropyPublicDecryption contract with EntropyOracle integration
 * @chapter public-decryption
 */
describe("EntropyPublicDecryption", function () {
  async function deployContractFixture() {
    const [owner] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyPublicDecryption");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as EntropyPublicDecryption;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyPublicDecryption");
    
    return { contract, owner, contractAddress, oracleAddress: ORACLE_ADDRESS };
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

  describe("Basic Public Decryption", function () {
    it("Should store and make publicly decryptable", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.storeAndMakePublic(encryptedInput.handles[0], encryptedInput.inputProof);
      
      expect(await contract.isInitialized()).to.be.true;
    });
  });

  describe("Entropy-Enhanced Public Decryption", function () {
    it("Should request entropy", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      
      const oracleAddress = await contract.getEntropyOracle();
      if (oracleAddress === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Skipping entropy test - EntropyOracle not deployed");
        return;
      }
      
      const tag = hre.ethers.id("test-public-decrypt");
      const fee = await contract.entropyOracle.getFee();
      
      await expect(
        contract.requestEntropy(tag, { value: fee })
      ).to.emit(contract, "EntropyRequested");
    });
  });
});


