import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Use existing EntropyOracle address (don't deploy new one)
  // Always use the latest deployed address (v3 with privacy enhancements)
  const entropyOracleAddress = "0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361";
  
  console.log("Deploying Example Contracts...");
  console.log("Deployer:", deployer);
  console.log("EntropyOracle:", entropyOracleAddress);

  // Deploy SimpleLottery
  const simpleLottery = await deploy("SimpleLottery", {
    from: deployer,
    args: [entropyOracleAddress],
    log: true,
    waitConfirmations: 1,
  });

  // Deploy RandomNumberGenerator
  const randomNumberGenerator = await deploy("RandomNumberGenerator", {
    from: deployer,
    args: [entropyOracleAddress],
    log: true,
    waitConfirmations: 1,
  });

  // Deploy NFTTraitSelector (old example)
  const nftTraitSelector = await deploy("NFTTraitSelector", {
    from: deployer,
    args: [entropyOracleAddress],
    log: true,
    waitConfirmations: 1,
  });

  // Deploy EntropyNFT (new real ERC721 NFT contract)
  const entropyNFT = await deploy("EntropyNFT", {
    from: deployer,
    args: [entropyOracleAddress, deployer], // oracle, initialOwner
    log: true,
    waitConfirmations: 1,
  });

  console.log("\n=== Deployment Summary ===");
  console.log("SimpleLottery:", simpleLottery.address);
  console.log("RandomNumberGenerator:", randomNumberGenerator.address);
  console.log("NFTTraitSelector:", nftTraitSelector.address);
  console.log("EntropyNFT:", entropyNFT.address);
  console.log("\nExample contracts deployed successfully!");
  
  console.log("\n=== Frontend Configuration ===");
  console.log(`REACT_APP_SIMPLE_LOTTERY_ADDRESS=${simpleLottery.address}`);
  console.log(`REACT_APP_RANDOM_NUMBER_GENERATOR_ADDRESS=${randomNumberGenerator.address}`);
  console.log(`REACT_APP_NFT_TRAIT_SELECTOR_ADDRESS=${nftTraitSelector.address}`);
  console.log(`REACT_APP_ENTROPY_NFT_ADDRESS=${entropyNFT.address}`);
};

export default func;
func.id = "deploy_examples";
func.tags = ["Examples"];
// Removed dependencies to avoid redeploying EntropyOracle

