import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("🚀 Starting deployment process...");
  
  try {
    // Get network information for better logging
    const network = await hre.ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);
    
    // This file is kept for compatibility but does nothing
    // All deployments are now in numbered deploy scripts (e.g., 02_deploy_ExperimentLog.ts)
    console.log("✅ Skipping deploy.ts - using numbered deployment scripts instead");
    
  } catch (error) {
    console.error("❌ Deployment preparation failed:", error);
    throw error;
  }
};

export default func;
func.tags = ["legacy", "preparation"];
