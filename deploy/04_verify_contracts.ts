import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network, run } = hre;

  // Skip verification on local networks
  if (network.name === "hardhat" || network.name === "localhost") {
    console.log("⏭️  Skipping contract verification on local network");
    return;
  }

  console.log("🔍 Starting contract verification process...");

  try {
    const experimentLogDeployment = await deployments.get("ExperimentLog");

    if (!experimentLogDeployment) {
      throw new Error("ExperimentLog deployment not found");
    }

    console.log(`📍 Verifying ExperimentLog at ${experimentLogDeployment.address}`);

    // Wait for additional confirmations before verification
    const waitConfirmations = network.name === "mainnet" ? 5 : 3;
    console.log(`⏳ Waiting for ${waitConfirmations} additional confirmations...`);

    await hre.ethers.provider.waitForTransaction(
      experimentLogDeployment.transactionHash!,
      waitConfirmations
    );

    console.log("✅ Confirmations received, proceeding with verification...");

    // Verify the contract
    await run("verify:verify", {
      address: experimentLogDeployment.address,
      constructorArguments: [],
    });

    console.log("✅ Contract verification completed successfully!");
    console.log(`🔗 View on explorer: ${getExplorerUrl(network.name, undefined, experimentLogDeployment.address)}`);

  } catch (error: any) {
    console.error("❌ Contract verification failed:", error.message);

    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract is already verified");
    } else {
      console.log("💡 You can manually verify later:");
      console.log(`npx hardhat verify --network ${network.name} <CONTRACT_ADDRESS>`);
      throw error; // Re-throw to fail the deployment
    }
  }
};

// Helper function to get explorer URL
function getExplorerUrl(networkName: string, txHash?: string, address?: string): string {
  const explorers: Record<string, string> = {
    sepolia: "https://sepolia.etherscan.io",
    mainnet: "https://etherscan.io",
    polygon: "https://polygonscan.com",
    zama: "https://explorer.zama.ai",
  };

  const baseUrl = explorers[networkName];
  if (!baseUrl) return "Explorer not configured";

  if (txHash) return `${baseUrl}/tx/${txHash}`;
  if (address) return `${baseUrl}/address/${address}`;
  return baseUrl;
}

export default func;
func.id = "verify_contracts";
func.tags = ["verify", "post-deploy"];
func.dependencies = ["ExperimentLog"];
func.runAtTheEnd = true; // Run after all other deployments
