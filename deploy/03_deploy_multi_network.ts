import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("🌐 Multi-network deployment configuration");
  console.log(`📡 Current network: ${network.name} (${network.config.chainId})`);

  // Network-specific configuration
  const networkConfigs = {
    hardhat: {
      confirmations: 1,
      gasPrice: undefined,
    },
    localhost: {
      confirmations: 1,
      gasPrice: undefined,
    },
    sepolia: {
      confirmations: 2,
      gasPrice: 20000000000n, // 20 gwei
    },
    mainnet: {
      confirmations: 3,
      gasPrice: 20000000000n, // 20 gwei
    },
    polygon: {
      confirmations: 2,
      gasPrice: 30000000000n, // 30 gwei
    },
    zama: {
      confirmations: 1,
      gasPrice: 1000000000n, // 1 gwei
    },
  };

  const config = networkConfigs[network.name as keyof typeof networkConfigs] || networkConfigs.hardhat;

  console.log(`⚙️  Confirmations: ${config.confirmations}`);
  console.log(`⛽ Gas price: ${config.gasPrice ? `${config.gasPrice / 1000000000n} gwei` : 'auto'}`);

  // This script serves as a template for multi-network deployments
  // The actual deployment logic is handled by individual numbered scripts
  console.log("✅ Multi-network configuration loaded successfully");
  console.log("💡 Use 'npm run deploy:<network>' for specific network deployments");
};

export default func;
func.id = "deploy_multi_network";
func.tags = ["multi-network", "config"];
func.dependencies = ["ExperimentLog"];
