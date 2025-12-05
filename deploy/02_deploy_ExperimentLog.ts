import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  console.log("Deploying ExperimentLog contract...");
  console.log("Deployer address:", deployer);

  // Estimate gas for deployment
  const ExperimentLogFactory = await hre.ethers.getContractFactory("ExperimentLog");
  const estimatedGas = await hre.ethers.provider.estimateGas(
    await ExperimentLogFactory.getDeployTransaction()
  );
  console.log("Estimated deployment gas:", estimatedGas.toString());

  const deployedExperimentLog = await deploy("ExperimentLog", {
    from: deployer,
    log: true,
    // Avoid redeploy if same bytecode already deployed (prevents duplicate nonces)
    skipIfAlreadyDeployed: true,
    // Add gas limit with buffer
    gasLimit: estimatedGas * BigInt(120) / BigInt(100), // 20% buffer
    // Wait for confirmations
    waitConfirmations: hre.network.name === "hardhat" ? 1 : 2,
  });

  console.log("✅ ExperimentLog contract deployed successfully!");
  console.log("📍 Contract address:", deployedExperimentLog.address);
  console.log("🌐 Network:", hre.network.name);
  console.log("👤 Deployer:", deployer);

  // Verify contract on Etherscan if not on localhost/hardhat
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    try {
      console.log("⏳ Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: deployedExperimentLog.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error);
      console.log("You can manually verify later with:");
      console.log(`npx hardhat verify --network ${hre.network.name} ${deployedExperimentLog.address}`);
    }
  }

  // Save deployment info for frontend
  const deploymentInfo = {
    network: hre.network.name,
    address: deployedExperimentLog.address,
    deployer,
    timestamp: new Date().toISOString(),
    blockNumber: deployedExperimentLog.receipt?.blockNumber,
    transactionHash: deployedExperimentLog.transactionHash,
  };

  console.log("💾 Saving deployment info...");
  const fs = require("fs");
  const path = require("path");

  const deploymentDir = path.join(__dirname, "..", "deployments", hre.network.name);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentDir, "ExperimentLog.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📋 Deployment summary:");
  console.log("- Contract: ExperimentLog");
  console.log("- Address:", deployedExperimentLog.address);
  console.log("- Network:", hre.network.name);
  console.log("- Gas used:", deployedExperimentLog.receipt?.gasUsed?.toString() || "Unknown");
  console.log("- Block:", deployedExperimentLog.receipt?.blockNumber || "Unknown");
  console.log("- Transaction:", deployedExperimentLog.transactionHash);
};

export default func;
func.id = "deploy_experiment_log"; // id required to prevent reexecution
func.tags = ["ExperimentLog", "core"];
func.dependencies = []; // No dependencies for this deployment
