import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Updating EntropyOracle with new FHEChaosEngine...");
  console.log("Deployer:", deployer.address);
  
  // New FHEChaosEngine address
  const NEW_CHAOS_ENGINE = "0x66561a3e849ABEd61cAE6c9e5614D7444a3ad674";
  
  // Current EntropyOracle address
  const ENTROPY_ORACLE = "0xE9F3c52442fA87221d23E924BcaCF13e6fCcbA03";
  
  const oracle = await ethers.getContractAt("EntropyOracle", ENTROPY_ORACLE);
  
  console.log("Current chaos engine:", await oracle.chaosEngine());
  console.log("New chaos engine:", NEW_CHAOS_ENGINE);
  
  console.log("Updating chaos engine...");
  const tx = await oracle.setChaosEngine(NEW_CHAOS_ENGINE);
  console.log("Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("Transaction confirmed!");
  console.log("New chaos engine:", await oracle.chaosEngine());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

