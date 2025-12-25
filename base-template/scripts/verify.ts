import hre from "hardhat";

// TODO: Update with your contract's constructor arguments
const CONSTRUCTOR_ARGS: any[] = [];

async function main() {
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.error("❌ Error: Contract address required");
    console.log("Usage: npm run verify <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log(`\n🔍 Verifying contract...`);
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Network: ${hre.network.name}`);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: CONSTRUCTOR_ARGS,
    });
    
    console.log(`\n✅ Contract verified successfully!`);
    const explorerUrl = hre.network.config.chainId === 11155111 
      ? `https://sepolia.etherscan.io/address/${contractAddress}`
      : `https://etherscan.io/address/${contractAddress}`;
    console.log(`\n🌐 View on Etherscan: ${explorerUrl}`);
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(`\n✅ Contract is already verified!`);
    } else {
      console.error(`\n❌ Verification failed:`);
      console.error(error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });






