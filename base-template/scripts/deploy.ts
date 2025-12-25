import hre from "hardhat";

// TODO: Update with your contract's constructor arguments
const CONSTRUCTOR_ARGS: any[] = [];

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  console.log(`\nDeploying contract...`);
  
  // TODO: Replace "Example" with your contract name
  const ContractFactory = await hre.ethers.getContractFactory("Example");
  const contract = await ContractFactory.deploy(...CONSTRUCTOR_ARGS);
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log(`\n✅ Contract deployed to:`, address);
  console.log(`\n📋 Deployment Details:`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Contract: Example`);
  console.log(`   Address: ${address}`);
  console.log(`\n🔍 Verify with:`);
  console.log(`   npm run verify ${address}`);
  
  return address;
}

main()
  .then((address) => {
    console.log(`\n✨ Deployment successful!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });






