# Lockbox Notes - Encrypted Experiment Log

A decentralized application for managing encrypted scientific experiment logs using Fully Homomorphic Encryption (FHE) on the blockchain. Built with FHEVM protocol by Zama, this application allows researchers to securely store, manage, and share their experimental data while maintaining complete privacy and confidentiality.

## 🎥 Demo

- **Live Demo**: [https://lockbox-notes.vercel.app/](https://lockbox-notes.vercel.app/)
- **Demo Video**: [demo.mp4](./demo.mp4)

## ✨ Features

- **🔐 End-to-End Encryption**: All experiment data is encrypted using FHE, ensuring complete privacy
- **📝 Experiment Management**: Create, update, and organize scientific experiments on-chain
- **🔬 Step-by-Step Tracking**: Record detailed experimental steps with encrypted titles and content
- **🔓 Selective Decryption**: Decrypt experiment data only when needed using wallet signatures
- **🌐 Multi-Network Support**: Seamlessly switch between local Hardhat network and Sepolia testnet
- **💼 Wallet Integration**: Connect with MetaMask via RainbowKit for secure transactions
- **🎨 Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Quick Start

For detailed instructions see:
[FHEVM Hardhat Quick Start Tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial)

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm or yarn/pnpm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC

   # Set your Infura API key for network access
   npx hardhat vars set INFURA_API_KEY

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile and test**

   ```bash
   npm run compile
   npm run test
   ```

4. **Deploy to local network**

   ```bash
   # Start a local FHEVM-ready node
   npx hardhat node
   # Deploy to local network
   npx hardhat deploy --network localhost
   ```

5. **Deploy to Sepolia Testnet**

   ```bash
   # Deploy to Sepolia
   npx hardhat deploy --network sepolia
   # Verify contract on Etherscan
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

6. **Test on Sepolia Testnet**

   ```bash
   # Once deployed, you can run a simple test on Sepolia.
   npx hardhat test --network sepolia
   ```

## 📁 Project Structure

```
lockbox-notes/
├── contracts/                    # Smart contract source files
│   └── ExperimentLog.sol        # Main FHE-enabled experiment log contract
├── deploy/                      # Deployment scripts
│   ├── deploy.ts                # Main deployment configuration
│   └── 02_deploy_ExperimentLog.ts  # ExperimentLog deployment script
├── test/                        # Test files
│   └── ExperimentLog.ts         # Comprehensive contract tests
├── frontend/                    # Next.js frontend application
│   ├── app/                     # Next.js app directory
│   ├── components/              # React components
│   │   ├── ExperimentNotebook.tsx  # Main experiment management UI
│   │   └── ExperimentStep.tsx      # Individual step component
│   ├── hooks/                   # Custom React hooks
│   │   └── useExperimentLog.tsx    # Contract interaction hook
│   ├── abi/                     # Contract ABIs and addresses
│   └── scripts/                 # Build and utility scripts
├── hardhat.config.ts            # Hardhat configuration
└── package.json                 # Dependencies and scripts
```

## 📜 Available Scripts

### Smart Contract Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests            |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |

### Frontend Scripts

Navigate to the `frontend` directory and run:

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start development server             |
| `npm run build`    | Build for production                 |
| `npm run start`    | Start production server              |
| `npm run genabi`   | Generate ABI files from contracts    |

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: Smart contract language
- **FHEVM**: Fully Homomorphic Encryption for blockchain
- **Hardhat**: Development environment and testing framework
- **Ethers.js**: Ethereum library for contract interaction

### Frontend
- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **RainbowKit**: Wallet connection UI
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum

## 🔒 How It Works

1. **Connect Wallet**: Users connect their MetaMask wallet via RainbowKit
2. **Create Experiment**: Initialize a new experiment with an encrypted name
3. **Add Steps**: Record experimental steps with encrypted titles and content
4. **Secure Storage**: All data is encrypted using FHE and stored on-chain
5. **Selective Decryption**: Users can decrypt their own data using wallet signatures
6. **Update & Manage**: Edit or delete experiment steps as needed

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments from the main branch:
- **Production**: [https://lockbox-notes.vercel.app/](https://lockbox-notes.vercel.app/)

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **FHEVM Issues**: [Report bugs or request features](https://github.com/zama-ai/fhevm/issues)
- **FHEVM Documentation**: [FHEVM Docs](https://docs.zama.ai)
- **Zama Community**: [Zama Discord](https://discord.gg/zama)

## 🙏 Acknowledgments

Built with the powerful FHEVM protocol by [Zama](https://www.zama.ai/), enabling fully homomorphic encryption on the blockchain.

---

**Built with 🔐 for privacy-preserving scientific research**
