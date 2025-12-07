import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyViewWithEncrypted } from "../types";

/**
 * @title EntropyViewWithEncrypted Tests
 * @notice Comprehensive tests for EntropyViewWithEncrypted contract (anti-pattern example)
 * @chapter anti-patterns
 */
describe("EntropyViewWithEncrypted", function () {
  async function deployContractFixture() {
    const [owner] = await hre.ethers.getSigners();
    
    // Use a valid non-zero address for testing (contract requires non-zero address)
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x1111111111111111111111111111111111111111";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyViewWithEncrypted");
    const contract = await ContractFactory.deploy(ORACLE_ADDRESS) as any;
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyViewWithEncrypted");
    
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

  describe("Anti-Pattern: View with Encrypted", function () {
    it("Should initialize encrypted value", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);
      
      // getValue() is NOT view - it's a regular function
      const value = await contract.getValue();
      expect(value).to.not.be.undefined;
    });
  });
});


