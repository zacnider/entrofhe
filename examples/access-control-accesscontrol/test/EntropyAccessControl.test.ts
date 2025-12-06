import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyAccessControl } from "../types";

/**
 * @title EntropyAccessControl Tests
 * @notice Comprehensive tests for EntropyAccessControl contract with EntropyOracle integration
 * @chapter access-control
 */
describe("EntropyAccessControl", function () {
  async function deployContractFixture() {
    const [owner, user1] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyAccessControl");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as EntropyAccessControl;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyAccessControl");
    
    return { contract, owner, user1, contractAddress, oracleAddress: ORACLE_ADDRESS };
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

  describe("Basic Access Control", function () {
    it("Should initialize and allow user", async function () {
      const { contract, contractAddress, owner, user1 } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      await contract.allowUser(user1.address);
      
      expect(await contract.isUserAllowed(user1.address)).to.be.true;
    });
  });

  describe("Entropy-Enhanced Access Control", function () {
    it("Should request entropy", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      const oracleAddress = await contract.getEntropyOracle();
      if (oracleAddress === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Skipping entropy test - EntropyOracle not deployed");
        return;
      }
      
      const tag = hre.ethers.id("test-access-control");
      const fee = await contract.entropyOracle.getFee();
      
      await expect(
        contract.requestEntropy(tag, { value: fee })
      ).to.emit(contract, "EntropyRequested");
    });
  });
});


