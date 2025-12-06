import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Get deployed FHEChaosEngine
  const chaosEngine = await get("FHEChaosEngine");
  
  // Fee recipient (default to deployer, can be changed later)
  const feeRecipient = deployer;

  console.log("Deploying EntropyOracle contract...");
  console.log("Deployer:", deployer);
  console.log("Chaos Engine:", chaosEngine.address);
  console.log("Fee Recipient:", feeRecipient);
  console.log("Fee Amount: 0.00001 ETH (10000000000000 wei)");

  const deployedOracle = await deploy("EntropyOracle", {
    from: deployer,
    args: [
      chaosEngine.address, // _chaosEngine
      feeRecipient,        // _feeRecipient
      deployer             // initialOwner
    ],
    log: true,
    waitConfirmations: 1,
  });

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Name: EntropyOracle");
  console.log("Contract Address:", deployedOracle.address);
  console.log("Deployer:", deployer);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  console.log("Chaos Engine:", chaosEngine.address);
  console.log("Fee Recipient:", feeRecipient);
  console.log("Fee Amount: 0.00001 ETH");
  console.log("\nEntropyOracle deployed successfully!");
  
  console.log("\n=== Deployment Info (for frontend .env) ===");
  console.log(`REACT_APP_ENTROPY_ORACLE_ADDRESS=${deployedOracle.address}`);
  console.log(`REACT_APP_CHAOS_ENGINE_ADDRESS=${chaosEngine.address}`);
};

export default func;
func.id = "deploy_entropy_oracle";
func.tags = ["EntropyOracle"];
func.dependencies = ["FHEChaosEngine"];

