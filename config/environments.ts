// Environment-specific configuration for deployment and testing

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer?: string;
  faucet?: string;
  gasPrice?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  hardhat: {
    name: "Hardhat",
    chainId: 31337,
    rpcUrl: "http://127.0.0.1:8545",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnet: true,
  },
  localhost: {
    name: "Localhost",
    chainId: 31337,
    rpcUrl: "http://127.0.0.1:8545",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnet: true,
  },
  sepolia: {
    name: "Sepolia",
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
    faucet: "https://sepoliafaucet.com",
    gasPrice: "20000000000", // 20 gwei
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnet: true,
  },
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: process.env.MAINNET_RPC_URL || "https://rpc.ankr.com/eth",
    blockExplorer: "https://etherscan.io",
    gasPrice: "20000000000", // 20 gwei
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnet: false,
  },
  polygon: {
    name: "Polygon",
    chainId: 137,
    rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    gasPrice: "30000000000", // 30 gwei
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    testnet: false,
  },
  zama: {
    name: "Zama Devnet",
    chainId: 327,
    rpcUrl: process.env.ZAMA_RPC_URL || "https://devnet.zama.ai",
    blockExplorer: "https://explorer.zama.ai",
    gasPrice: "1000000000", // 1 gwei
    nativeCurrency: {
      name: "Zama",
      symbol: "ZAMA",
      decimals: 18,
    },
    testnet: true,
  },
};

export function getNetworkConfig(networkName: string): NetworkConfig | undefined {
  return NETWORKS[networkName];
}

export function isTestnet(networkName: string): boolean {
  const config = getNetworkConfig(networkName);
  return config?.testnet ?? true;
}

export function getExplorerUrl(networkName: string, txHash?: string, address?: string): string | undefined {
  const config = getNetworkConfig(networkName);
  if (!config?.blockExplorer) return undefined;

  if (txHash) return `${config.blockExplorer}/tx/${txHash}`;
  if (address) return `${config.blockExplorer}/address/${address}`;
  return config.blockExplorer;
}
