import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, network } = hre;

  console.log("📊 Performance monitoring and optimization report\n");

  try {
    const experimentLogDeployment = await deployments.get("ExperimentLog");
    const experimentLog = await ethers.getContractAt("ExperimentLog", experimentLogDeployment.address);

    // Basic contract metrics
    console.log("📈 Contract Metrics:");
    const experimentCount = await experimentLog.getExperimentCount();
    const stepCount = await experimentLog.getStepCount();
    console.log(`   Experiments: ${experimentCount}`);
    console.log(`   Steps: ${stepCount}`);

    // Estimate gas costs for common operations
    console.log("\n⛽ Estimated Gas Costs:");

    if (experimentCount < 5) { // Only run expensive gas estimations on small datasets
      const [deployer] = await ethers.getSigners();

      try {
        // Estimate createExperiment gas
        const experimentName = "Performance Test Experiment " + Date.now();
        const createExperimentTx = await experimentLog.createExperiment.populateTransaction(experimentName);
        const createGas = await ethers.provider.estimateGas({
          ...createExperimentTx,
          from: deployer.address
        });
        console.log(`   Create Experiment: ${createGas} gas`);

        // Estimate addStep gas
        const addStepTx = await experimentLog.addStep.populateTransaction(0, "Test Step", "Test Content", false);
        const addStepGas = await ethers.provider.estimateGas({
          ...addStepTx,
          from: deployer.address
        });
        console.log(`   Add Step: ${addStepGas} gas`);

      } catch (error) {
        console.log("   ⚠️  Gas estimation skipped (insufficient data or permissions)");
      }
    } else {
      console.log("   ⏭️  Gas estimation skipped (too many experiments for safe estimation)");
    }

    // Network performance
    console.log("\n🌐 Network Performance:");
    const startTime = Date.now();
    const blockNumber = await ethers.provider.getBlockNumber();
    const endTime = Date.now();
    const latency = endTime - startTime;

    console.log(`   Current block: ${blockNumber}`);
    console.log(`   Network latency: ${latency}ms`);

    // Fee data
    const feeData = await ethers.provider.getFeeData();
    if (feeData.gasPrice) {
      const gasPriceGwei = Number(feeData.gasPrice) / 1e9;
      console.log(`   Gas price: ${gasPriceGwei.toFixed(2)} gwei`);
    }

    // Recommendations
    console.log("\n💡 Optimization Recommendations:");

    if (experimentCount > 100) {
      console.log("   📊 Consider implementing pagination for large experiment lists");
    }

    if (stepCount > 1000) {
      console.log("   🔄 Consider batch operations for bulk step management");
    }

    if (network.name === "mainnet") {
      console.log("   ⚡ Mainnet deployment detected - monitor gas costs carefully");
    }

    if (latency > 5000) {
      console.log("   🐌 High network latency detected - consider RPC provider optimization");
    }

    console.log("\n✅ Performance monitoring completed!");

  } catch (error: any) {
    console.error("❌ Performance monitoring failed:", error.message);
    throw error;
  }
};

export default func;
func.id = "performance_monitor";
func.tags = ["performance", "monitor", "optimization"];
func.dependencies = ["ExperimentLog"];
func.runAtTheEnd = true;
