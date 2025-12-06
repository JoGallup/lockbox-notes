// Deployment and network configuration types

export interface DeploymentInfo {
  network: string;
  address: string;
  deployer: string;
  timestamp: string;
  blockNumber?: number;
  transactionHash?: string;
  verified?: boolean;
  gasUsed?: string;
}

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
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface DeploymentResult {
  success: boolean;
  address?: string;
  transactionHash?: string;
  gasUsed?: bigint;
  error?: string;
  verificationUrl?: string;
}

export interface ContractVerification {
  success: boolean;
  url?: string;
  error?: string;
  guid?: string; // Etherscan verification GUID
}

export interface PerformanceMetrics {
  deploymentGas: bigint;
  averageGasPerOperation: Record<string, bigint>;
  networkLatency: number;
  blockTime: number;
  gasPrice: bigint;
  recommendations: string[];
}

export interface BatchOperationResult {
  operationId: string;
  success: boolean;
  gasUsed?: bigint;
  error?: string;
  transactionHash?: string;
}

export type DeploymentStage = 'preparation' | 'compilation' | 'deployment' | 'verification' | 'testing' | 'completed';

export interface DeploymentProgress {
  stage: DeploymentStage;
  progress: number; // 0-100
  message: string;
  timestamp: Date;
}

export interface MultiNetworkDeployment {
  networks: string[];
  results: Record<string, DeploymentResult>;
  summary: {
    successful: number;
    failed: number;
    totalGasUsed: bigint;
    averageDeploymentTime: number;
  };
}
