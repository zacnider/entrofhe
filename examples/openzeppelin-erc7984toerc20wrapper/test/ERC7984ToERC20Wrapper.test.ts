import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropyERC7984ToERC20Wrapper } from "../types";

/**
 * @title EntropyERC7984ToERC20Wrapper Tests
 * @notice Comprehensive tests for ERC7984 to ERC20 wrapper with EntropyOracle integration
 * @chapter openzeppelin
 */
describe("EntropyERC7984ToERC20Wrapper", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropyERC7984ToERC20Wrapper");
    const contract = await ContractFactory.deploy(
      ORACLE_ADDRESS,
      "Wrapped Token",
      "WPT"
    ) as EntropyERC7984ToERC20Wrapper;
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropyERC7984ToERC20Wrapper");
    
    return { contract, owner, user1, user2, contractAddress, oracleAddress: ORACLE_ADDRESS };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should have correct name and symbol", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.name()).to.equal("Wrapped Token");
      expect(await contract.symbol()).to.equal("WPT");
    });

    it("Should have EntropyOracle address set", async function () {
      const { contract, oracleAddress } = await loadFixture(deployContractsFixture);
      expect(await contract.getEntropyOracle()).to.equal(oracleAddress);
    });
  });

  describe("Wrapping with Entropy", function () {
    it("Should request entropy for wrapping", async function () {
      const { contract, user1 } = await loadFixture(deployContractsFixture);
      
      const tag = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("wrap"));
      const fee = hre.ethers.parseEther("0.00001");
      
      await expect(
        contract.connect(user1).requestWrapWithEntropy(tag, { value: fee })
      ).to.emit(contract, "WrapRequested");
    });
  });
});
