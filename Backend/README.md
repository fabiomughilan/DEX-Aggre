# GlueX Backend API Server

This is the backend API server for the GlueX DEX aggregation platform.

## Features

- **Quote API**: Get swap quotes from GlueX router
- **Swap API**: Execute swap transactions
- **Chain Support**: Multiple blockchain networks
- **Token Support**: Native tokens and USDC for each chain

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
# GlueX API Configuration
GLUEX_API_KEY=your_gluex_api_key_here

# RPC URLs for different chains
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_alchemy_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/your_alchemy_key
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/your_alchemy_key
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your_alchemy_key
OPTIMISM_RPC_URL=https://opt-mainnet.g.alchemy.com/v2/your_alchemy_key

# Server Configuration
PORT=3001
```

3. Get your API keys:
   - **GlueX API Key**: Visit [GlueX](https://gluex.xyz/) to get your API key
   - **RPC URLs**: Get free API keys from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3001 (or the port specified in your .env file).

## API Endpoints

### GET /api/health
Health check endpoint.

### GET /api/chains
Get list of supported blockchain networks.

### GET /api/tokens/:chainId
Get list of supported tokens for a specific chain.

### POST /api/quote
Get a swap quote from GlueX router.

**Request Body:**
```json
{
  "inputToken": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "outputToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "inputAmount": "10000000000000000",
  "userAddress": "0x...",
  "chainID": "ethereum"
}
```

### POST /api/swap
Execute a swap transaction.

**Request Body:**
```json
{
  "calldata": "0x...",
  "routerAddress": "0x...",
  "value": "10000000000000000",
  "chainId": 1,
  "userAddress": "0x...",
  "privateKey": "0x..."
}
```

## Supported Chains

- Ethereum (Mainnet & Sepolia)
- Arbitrum
- Base
- Gnosis
- Polygon
- Optimism

## Security Notes

- **Never expose private keys in production**
- **Use environment variables for sensitive data**
- **Implement proper authentication in production**
- **Consider using wallet connection libraries instead of private key input**

## Development

The server is built with:
- Node.js
- Express.js
- Web3.js
- Axios for HTTP requests
- CORS enabled for frontend integration