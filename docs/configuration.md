# Configuration Guide

This document provides comprehensive configuration options for the Lockbox Notes application.

## Environment Variables

Create a `.env` file in the project root with the following variables:

### Network Configuration

```bash
# Ethereum Networks
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Polygon Network
POLYGON_RPC_URL=https://polygon-rpc.com

# Zama Network
ZAMA_RPC_URL=https://devnet.zama.ai

# Local Development
LOCAL_RPC_URL=http://127.0.0.1:8545
LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### API Keys & Secrets

```bash
# Blockchain Explorer APIs
INFURA_API_KEY=your_infura_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Deployment Private Keys
PRIVATE_KEY=your_private_key_without_0x_prefix
MAINNET_PRIVATE_KEY=your_mainnet_private_key_without_0x_prefix
```

### Development Settings

```bash
# Hardhat Configuration
REPORT_GAS=true
MNEMONIC="test test test test test test test test test test test junk"

# Gas Price Overrides (in gwei)
MAX_FEE_PER_GAS_GWEI=50
MAX_PRIORITY_FEE_PER_GAS_GWEI=2
```

### Feature Flags

```bash
# Enable experimental features
ENABLE_BATCH_OPERATIONS=true
ENABLE_ADVANCED_SEARCH=true
ENABLE_AUTO_SAVE=true
ENABLE_PERFORMANCE_INSIGHTS=true

# Multi-language support
ENABLE_I18N=true
DEFAULT_LANGUAGE=en
```

## Hardhat Configuration

The `hardhat.config.ts` file supports multiple network configurations:

- **hardhat**: Local Hardhat network for testing
- **localhost**: Local development network
- **sepolia**: Ethereum Sepolia testnet
- **mainnet**: Ethereum mainnet
- **polygon**: Polygon mainnet
- **zama**: Zama testnet

## Contract Deployment

### Local Deployment

```bash
npm run deploy:local
```

### Testnet Deployment

```bash
npm run deploy:sepolia
npm run deploy:polygon
```

### Mainnet Deployment

```bash
npm run deploy:mainnet
```

## Frontend Configuration

### Environment Variables for Frontend

Create `.env.local` in the `frontend` directory:

```bash
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_ENABLE_I18N=true
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## Docker Configuration

### Development

```bash
docker-compose up hardhat-node frontend-dev
```

### Production

```bash
docker-compose -f docker-compose.yml up frontend-prod
```

## CI/CD Configuration

The GitHub Actions workflow (`.github/workflows/ci.yml`) includes:

- Automated testing on multiple Node.js versions
- Security vulnerability scanning
- Multi-network deployment
- Code coverage reporting

### Required Secrets for CI/CD

Set these in your GitHub repository secrets:

- `INFURA_API_KEY`
- `ETHERSCAN_API_KEY`
- `SEPOLIA_PRIVATE_KEY`
- `MAINNET_PRIVATE_KEY` (for production)

## Performance Monitoring

Enable performance monitoring by setting:

```bash
ENABLE_PERFORMANCE_MONITORING=true
```

This will track Core Web Vitals and network metrics.

## Internationalization

Supported languages:

- English (en)
- Chinese (zh)
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)

Language is automatically detected from browser settings or can be manually set.

## Security Considerations

### Private Keys

- Never commit private keys to version control
- Use environment variables for sensitive data
- Use different keys for different networks
- Consider using hardware wallets for mainnet deployments

### API Keys

- Store API keys securely in environment variables
- Use restricted API keys with minimal permissions
- Rotate keys regularly
- Monitor API usage

### Network Security

- Always verify contract addresses before interaction
- Use checksummed addresses
- Validate all inputs on both frontend and smart contracts
- Implement proper error handling

## Troubleshooting

### Common Issues

1. **Network Connection Issues**
   - Verify RPC URLs are correct
   - Check API key validity
   - Ensure network is not congested

2. **Contract Deployment Failures**
   - Verify sufficient funds in deployer account
   - Check gas price settings
   - Ensure network is accessible

3. **Verification Issues**
   - Confirm API keys are set correctly
   - Check contract code matches deployed bytecode
   - Wait for sufficient block confirmations

4. **Frontend Connection Issues**
   - Verify contract addresses are correct
   - Check network configuration matches deployed network
   - Ensure MetaMask is connected to correct network

### Debug Commands

```bash
# Check deployment status
npm run deploy:check

# Monitor performance
npm run performance:monitor

# View network information
npm run network:info

# Check account balances
npm run accounts
```

## Advanced Configuration

### Custom Network Addition

To add a custom network, update `hardhat.config.ts`:

```typescript
customNetwork: {
  url: "https://custom.rpc.url",
  accounts: [process.env.CUSTOM_PRIVATE_KEY],
  chainId: 12345,
}
```

### Compiler Optimization

Adjust Solidity compiler optimization in `hardhat.config.ts`:

```typescript
solidity: {
  version: "0.8.27",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000, // Higher runs = better runtime optimization
    }
  }
}
```

### Gas Reporting

Enable detailed gas reporting:

```bash
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_api_key
```

This provides cost estimates in USD for all transactions.
