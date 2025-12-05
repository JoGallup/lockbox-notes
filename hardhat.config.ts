import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import type { HardhatUserConfig } from "hardhat/config";
import { parseUnits } from "ethers";
import { vars as _vars } from "hardhat/config";
import "dotenv/config";
import "solidity-coverage";

// Environment configuration validation
function validateEnvironment(): void {
  const requiredVars = [
    'INFURA_API_KEY',
    'ETHERSCAN_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some features may not work properly. Set them in your .env file or use:');
    console.warn('npx hardhat vars set <VARIABLE_NAME>');
  }

  // Validate network configurations
  if (process.env.SEPOLIA_RPC_URL && !process.env.SEPOLIA_RPC_URL.includes('infura.io') && !process.env.SEPOLIA_RPC_URL.includes('sepolia')) {
    console.warn('⚠️  SEPOLIA_RPC_URL seems incorrect. Expected Infura or Alchemy URL');
  }
}

// Validate environment on config load
validateEnvironment();

// Deployment configuration helper
function getDeploymentConfig(networkName: string) {
  const configs = {
    hardhat: { confirmations: 1, timeout: 60000 },
    localhost: { confirmations: 1, timeout: 60000 },
    sepolia: { confirmations: 2, timeout: 120000 },
    mainnet: { confirmations: 3, timeout: 300000 },
    polygon: { confirmations: 2, timeout: 120000 },
    zama: { confirmations: 1, timeout: 120000 },
  };

  return configs[networkName as keyof typeof configs] || configs.hardhat;
}

import "./tasks/accounts";

// Run 'npx hardhat vars setup' to see the list of variables that need to be set

// Provide a safe fallback for Hardhat <2.22 where `vars` is not available
const vars = (_vars as any) ?? { get: (_name: string, fallback = "") => fallback };

// Prefer environment variables first; fallback to hardhat vars when useful
const MNEMONIC: string = vars.get("MNEMONIC", "test test test test test test test test test test test junk");
const INFURA_API_KEY: string = process.env.INFURA_API_KEY ?? vars.get("INFURA_API_KEY", "");
const SEPOLIA_RPC_URL: string =
  process.env.SEPOLIA_RPC_URL ?? (INFURA_API_KEY ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}` : "https://rpc.sepolia.org");
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY ?? vars.get("ETHERSCAN_API_KEY", "");
const RAW_PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY || undefined;
const PRIVATE_KEY: string | undefined = RAW_PRIVATE_KEY
  ? RAW_PRIVATE_KEY.startsWith("0x")
    ? RAW_PRIVATE_KEY
    : `0x${RAW_PRIVATE_KEY}`
  : undefined;
const RAW_LOCAL_PRIVATE_KEY: string | undefined = process.env.LOCAL_PRIVATE_KEY || undefined;
const LOCAL_PRIVATE_KEY: string | undefined = RAW_LOCAL_PRIVATE_KEY
  ? RAW_LOCAL_PRIVATE_KEY.startsWith("0x")
    ? RAW_LOCAL_PRIVATE_KEY
    : `0x${RAW_LOCAL_PRIVATE_KEY}`
  : undefined;

// Optional EIP-1559 gas overrides for live networks (in gwei)
const MAX_FEE_PER_GAS_GWEI = process.env.MAX_FEE_PER_GAS_GWEI;
const MAX_PRIORITY_FEE_PER_GAS_GWEI = process.env.MAX_PRIORITY_FEE_PER_GAS_GWEI;
const maxFeePerGas = MAX_FEE_PER_GAS_GWEI ? parseUnits(String(MAX_FEE_PER_GAS_GWEI), "gwei") : undefined;
const maxPriorityFeePerGas = MAX_PRIORITY_FEE_PER_GAS_GWEI ? parseUnits(String(MAX_PRIORITY_FEE_PER_GAS_GWEI), "gwei") : undefined;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
    admin: 1,
    user1: 2,
    user2: 3,
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      mainnet: vars.get("MAINNET_ETHERSCAN_API_KEY", ""),
      polygon: vars.get("POLYGONSCAN_API_KEY", ""),
      arbitrumOne: vars.get("ARBISCAN_API_KEY", ""),
      optimism: vars.get("OPTIMISM_ETHERSCAN_API_KEY", ""),
    },
    customChains: [
      {
        network: "zama",
        chainId: 327,
        urls: {
          apiURL: "https://explorer.zama.ai/api",
          browserURL: "https://explorer.zama.ai",
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    showMethodSig: true,
    showTimeSpent: true,
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      hardfork: "cancun",
      chainId: 31337,
    },
    localhost: {
      url: process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545",
      accounts: LOCAL_PRIVATE_KEY ? [LOCAL_PRIVATE_KEY] : undefined,
      chainId: 31337,
    },
    anvil: {
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0/",
        count: 10,
      },
      chainId: 31337,
      url: "http://localhost:8545",
    },
    sepolia: {
      accounts: PRIVATE_KEY
        ? [PRIVATE_KEY]
        : {
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0/",
            count: 10,
          },
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      timeout: 120000,
      ...(maxFeePerGas ? { maxFeePerGas } : {}),
      ...(maxPriorityFeePerGas ? { maxPriorityFeePerGas } : {}),
    },
    mainnet: {
      accounts: PRIVATE_KEY
        ? [PRIVATE_KEY]
        : {
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0/",
            count: 5, // Fewer accounts for mainnet for security
          },
      chainId: 1,
      url: process.env.MAINNET_RPC_URL ?? `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      timeout: 120000,
      ...(maxFeePerGas ? { maxFeePerGas } : {}),
      ...(maxPriorityFeePerGas ? { maxPriorityFeePerGas } : {}),
    },
    polygon: {
      accounts: PRIVATE_KEY
        ? [PRIVATE_KEY]
        : {
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0/",
            count: 10,
          },
      chainId: 137,
      url: process.env.POLYGON_RPC_URL ?? "https://polygon-rpc.com",
      timeout: 120000,
      gasPrice: 30000000000, // 30 gwei
    },
    zama: {
      accounts: PRIVATE_KEY
        ? [PRIVATE_KEY]
        : {
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0/",
            count: 5,
          },
      chainId: 327,
      url: process.env.ZAMA_RPC_URL ?? "https://devnet.zama.ai",
      timeout: 120000,
      gasPrice: 1000000000, // 1 gwei
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.27",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Enhanced optimizer settings for better gas efficiency
      optimizer: {
        enabled: true,
        runs: 1000, // Higher runs for better runtime gas optimization
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
          },
        },
      },
      evmVersion: "cancun",
      // Additional optimization for contract size
      viaIR: true,
      // Output selection for better debugging
      outputSelection: {
        "*": {
          "*": ["evm.bytecode", "evm.deployedBytecode", "devdoc", "userdoc", "metadata", "abi", "storageLayout"],
        },
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
  // Custom paths for better organization
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deployments: "./deployments",
  },
  // Contract sizing for optimization tracking
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};

export default config;
