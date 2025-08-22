# GlueX DEX Aggregation Platform

A complete decentralized exchange (DEX) aggregation platform that connects to the GlueX router for optimal swap routes across multiple blockchain networks.

## 🚀 Features

- **Multi-Chain Support**: Ethereum, Arbitrum, Base, Polygon, Optimism, and more
- **Real-Time Quotes**: Get optimal swap routes from GlueX router
- **Token Swapping**: Execute swaps with automatic gas estimation
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Backend API**: Express.js server with comprehensive swap functionality
- **Wallet Integration**: Connect wallets and execute transactions

## 🏗️ Architecture

```
Frontend (React + TypeScript) ←→ Backend API (Express + Web3) ←→ GlueX Router
```

- **Frontend**: React application with modern UI components
- **Backend**: Express.js API server handling swap logic
- **Blockchain**: Web3.js integration for transaction execution
- **Routing**: GlueX router for optimal DEX aggregation

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- Vite for fast development
- React Query for state management

### Backend
- Node.js + Express.js
- Web3.js for blockchain interaction
- Axios for HTTP requests
- CORS enabled for frontend integration

## 📦 Installation

### Quick Setup (Windows)
1. Run the setup script:
   ```bash
   setup.bat
   ```

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gluex
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `Backend` folder:
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

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd Backend
npm run dev
```
The backend will start on `http://localhost:3001`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### 3. Open Your Browser
Navigate to `http://localhost:5173` to use the application

## 🔑 Getting API Keys

### GlueX API Key
1. Visit [GlueX](https://gluex.xyz/)
2. Sign up for an account
3. Generate your API key

### RPC URLs (Alchemy)
1. Visit [Alchemy](https://www.alchemy.com/)
2. Create a free account
3. Create apps for each blockchain network
4. Copy the HTTP URLs to your `.env` file

### RPC URLs (Infura)
1. Visit [Infura](https://infura.io/)
2. Create a free account
3. Create projects for each blockchain network
4. Copy the HTTP URLs to your `.env` file

## 📱 Usage

### 1. Connect Wallet
- Click "Connect wallet" button
- Enter your wallet address and private key (for demo purposes)
- In production, integrate with MetaMask or other wallet providers

### 2. Select Chain
- Choose from supported blockchain networks
- Each chain has its own token set

### 3. Select Tokens
- Choose input and output tokens
- Available tokens are loaded dynamically based on the selected chain

### 4. Enter Amount
- Input the amount you want to swap
- Real-time quotes will be fetched automatically

### 5. Execute Swap
- Review the quote details
- Click "Swap" to execute the transaction
- Monitor transaction status

## 🔧 API Endpoints

### Backend API (`http://localhost:3001/api`)

- `GET /health` - Health check
- `GET /chains` - Get supported chains
- `GET /tokens/:chainId` - Get tokens for a chain
- `POST /quote` - Get swap quote
- `POST /swap` - Execute swap transaction

## 🛡️ Security Considerations

- **Never expose private keys in production**
- **Use environment variables for sensitive data**
- **Implement proper authentication in production**
- **Consider using wallet connection libraries instead of private key input**
- **Validate all user inputs on both frontend and backend**

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
Gluex/
├── Backend/                 # Backend API server
│   ├── index.ts            # Main server file
│   ├── swap.ts             # Swap logic (legacy)
│   ├── tokens.ts           # Token definitions
│   ├── chain.ts            # Chain configurations
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # App entry point
│   └── package.json        # Frontend dependencies
├── setup.bat               # Windows setup script
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your API keys are correct
3. Ensure both backend and frontend are running
4. Check the network tab for API call failures

## 🔮 Future Enhancements

- [ ] MetaMask integration
- [ ] Transaction history
- [ ] Price charts
- [ ] Portfolio tracking
- [ ] Multi-wallet support
- [ ] Advanced routing options
- [ ] Gas optimization
- [ ] Mobile app
