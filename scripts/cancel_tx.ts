import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Cancelling pending transaction...");
  console.log("Deployer:", deployer.address);
  
  // Get current nonce
  const nonce = await deployer.provider.getTransactionCount(deployer.address, "pending");
  console.log("Current nonce (pending):", nonce);
  
  // Send a replacement transaction with higher gas price
  // Sending 0 ETH to self to cancel the pending transaction
  const tx = await deployer.sendTransaction({
    to: deployer.address,
    value: 0,
    nonce: nonce - 1, // Use the nonce of the pending transaction
    gasPrice: ethers.parseUnits("5", "gwei"), // Higher gas price
    gasLimit: 21000,
  });
  
  console.log("Replacement transaction sent:", tx.hash);
  console.log("Waiting for confirmation...");
  
  await tx.wait();
  console.log("Transaction confirmed! Pending transaction should be cancelled.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

