import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { EntropySwapERC7984ToERC7984 } from "../types";

/**
 * @title EntropySwapERC7984ToERC7984 Tests
 * @notice Comprehensive tests for ERC7984 to ERC7984 swap with EntropyOracle integration
 * @chapter openzeppelin
 */
describe("EntropySwapERC7984ToERC7984", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    const ORACLE_ADDRESS = process.env.ENTROPY_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000";
    const TOKEN_A = "0x0000000000000000000000000000000000000001";
    const TOKEN_B = "0x0000000000000000000000000000000000000002";
    
    const ContractFactory = await hre.ethers.getContractFactory("EntropySwapERC7984ToERC7984");
    const contract = await ContractFactory.deploy(
      ORACLE_ADDRESS,
      TOKEN_A,
      TOKEN_B
    ) as EntropySwapERC7984ToERC7984;
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    await hre.fhevm.assertCoprocessorInitialized(contract, "EntropySwapERC7984ToERC7984");
    
    return { contract, owner, user1, user2, contractAddress, oracleAddress: ORACLE_ADDRESS };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should have correct token addresses", async function () {
      const { contract } = await loadFixture(deployContractsFixture);
      expect(await contract.tokenA()).to.equal("0x0000000000000000000000000000000000000001");
      expect(await contract.tokenB()).to.equal("0x0000000000000000000000000000000000000002");
    });

    it("Should have EntropyOracle address set", async function () {
      const { contract, oracleAddress } = await loadFixture(deployContractsFixture);
      expect(await contract.getEntropyOracle()).to.equal(oracleAddress);
    });
  });

  describe("Swapping with Entropy", function () {
    it("Should request entropy for swap", async function () {
      const { contract, user1 } = await loadFixture(deployContractsFixture);
      
      const tag = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("swap"));
      const fee = hre.ethers.parseEther("0.00001");
      
      await expect(
        contract.connect(user1).requestSwapWithEntropy(tag, { value: fee })
      ).to.emit(contract, "SwapRequested");
    });
  });
});
