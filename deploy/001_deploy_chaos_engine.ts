import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying FHEChaosEngine contract...");
  console.log("Deployer:", deployer);

  const deployedEngine = await deploy("FHEChaosEngine", {
    from: deployer,
    args: [deployer], // initialOwner
    log: true,
    waitConfirmations: 1,
  });

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Name: FHEChaosEngine");
  console.log("Contract Address:", deployedEngine.address);
  console.log("Deployer:", deployer);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  console.log("\nFHEChaosEngine deployed successfully!");
  console.log("\nIMPORTANT: Initialize master seed after deployment!");
  console.log("   Use: initializeMasterSeed(encryptedSeed, inputProof)");
};

export default func;
func.id = "deploy_chaos_engine";
func.tags = ["FHEChaosEngine"];

