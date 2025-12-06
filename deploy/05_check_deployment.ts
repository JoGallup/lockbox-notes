import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { deployer } = await getNamedAccounts();

  console.log("🔍 Checking deployment status...\n");

  try {
    // Check if ExperimentLog is deployed
    const experimentLogDeployment = await deployments.getOrNull("ExperimentLog");

    if (!experimentLogDeployment) {
      console.log("❌ ExperimentLog contract not found");
      console.log("💡 Run deployment first: npx hardhat deploy --network", network.name);
      return;
    }

    console.log("✅ ExperimentLog contract found");
    console.log(`📍 Address: ${experimentLogDeployment.address}`);
    console.log(`📄 Transaction: ${experimentLogDeployment.transactionHash}`);

    // Check contract code
    const code = await ethers.provider.getCode(experimentLogDeployment.address);
    const isDeployed = code !== "0x";

    if (!isDeployed) {
      console.log("❌ Contract code not found at address");
      return;
    }

    console.log("✅ Contract code verified");

    // Try to interact with the contract
    const experimentLog = await ethers.getContractAt("ExperimentLog", experimentLogDeployment.address);

    try {
      const experimentCount = await experimentLog.getExperimentCount();
      const stepCount = await experimentLog.getStepCount();

      console.log("✅ Contract interaction successful");
      console.log(`📊 Experiments: ${experimentCount}`);
      console.log(`📝 Steps: ${stepCount}`);

      // Check deployer balance
      const balance = await ethers.provider.getBalance(deployer);
      const balanceInEther = ethers.formatEther(balance);
      console.log(`💰 Deployer balance: ${balanceInEther} ETH`);

      // Network info
      const networkInfo = await ethers.provider.getNetwork();
      const blockNumber = await ethers.provider.getBlockNumber();
      console.log(`🌐 Network: ${networkInfo.name} (${networkInfo.chainId})`);
      console.log(`📦 Block: ${blockNumber}`);

      // Gas price
      const feeData = await ethers.provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      if (gasPrice) {
        const gasPriceGwei = Number(gasPrice) / 1e9;
        console.log(`⛽ Gas price: ${gasPriceGwei.toFixed(2)} gwei`);
      }

    } catch (error) {
      console.log("⚠️  Contract interaction failed:", error);
      console.log("This might indicate deployment issues or network problems");
    }

    console.log("\n🎉 Deployment status check completed!");

  } catch (error: any) {
    console.error("❌ Deployment status check failed:", error.message);
    throw error;
  }
};

export default func;
func.id = "check_deployment";
func.tags = ["check", "status", "diagnostic"];
func.dependencies = ["ExperimentLog"];
func.runAtTheEnd = true;
