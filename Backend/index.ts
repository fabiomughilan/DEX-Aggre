import express from "express";
import cors from "cors";
import "dotenv/config";
import Web3 from "web3";
import axios, { AxiosResponse } from "axios";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// -------- Types
interface GlueXQuote {
  statusCode: number;
  result?: { router: string; calldata: string };
  error?: string;
}

interface QuoteRequest {
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  userAddress: string;
  outputReceiver: string;
  chainID: string;
  uniquePID: string;
  isPermit2: boolean;
}

interface SwapRequest {
  calldata: string;
  routerAddress: string;
  value: string;
  chainId: number;
  userAddress: string;
  privateKey: string;
}

interface TokenPriceRequest {
  domestic_blockchain: string;
  domestic_token: string;
  foreign_blockchain: string;
  foreign_token: string;
}

interface TokenPriceResponse {
  domestic_blockchain: string;
  domestic_token: string;
  foreign_blockchain: string;
  foreign_token: string;
  price: number;
}

// -------- Config
const API_KEY = process.env.GLUEX_API_KEY ?? "";
const UNIQUE_PID = "f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d";
const QUOTE_ENDPOINT = "https://router.gluex.xyz/v1/quote";
const PRICE_ENDPOINT = "https://exchange-rates.gluex.xyz/";

// -------- Helpers
const fetchQuote = async (
  body: QuoteRequest,
  headers: Record<string, string>
): Promise<GlueXQuote> => {
  const res: AxiosResponse<GlueXQuote> = await axios.post(QUOTE_ENDPOINT, body, { headers });
  return res.data;
};

const fetchTokenPrice = async (requests: TokenPriceRequest[]): Promise<TokenPriceResponse[]> => {
  const response = await fetch(PRICE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requests),
  });

  if (!response.ok) {
    throw new Error(`Error fetching price: ${response.statusText}`);
  }

  const data = await response.json() as TokenPriceResponse[];
  return data;
};

// -------- API Routes

// Get token prices for conversion rates
app.post("/api/prices", async (req, res) => {
  try {
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests)) {
      return res.status(400).json({ error: "Missing or invalid requests array" });
    }

    const priceData = await fetchTokenPrice(requests);
    
    res.json({
      success: true,
      data: priceData
    });
  } catch (error: any) {
    console.error("Price fetch error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Get quote for a swap
app.post("/api/quote", async (req, res) => {
  try {
    const { inputToken, outputToken, inputAmount, userAddress, chainID } = req.body;

    if (!inputToken || !outputToken || !inputAmount || !userAddress || !chainID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const headers = { "x-api-key": API_KEY };
    const body = {
      chainID,
      userAddress,
      outputReceiver: userAddress,
      uniquePID: UNIQUE_PID,
      inputToken,
      outputToken,
      inputAmount,
      isPermit2: false,
    };

    const quote = await fetchQuote(body, headers);
    
    if (quote.statusCode !== 200 || !quote.result) {
      return res.status(400).json({ error: quote.error || "Failed to get quote" });
    }

    res.json({
      success: true,
      data: {
        router: quote.result.router,
        calldata: quote.result.calldata,
        inputAmount,
        outputAmount: "0", // This would come from the quote in a real implementation
      }
    });
  } catch (error: any) {
    console.error("Quote error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Execute a swap transaction
app.post("/api/swap", async (req, res) => {
  try {
    const { calldata, routerAddress, value, chainId, userAddress, privateKey } = req.body as SwapRequest;

    if (!calldata || !routerAddress || !value || !chainId || !userAddress || !privateKey) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Initialize Web3 with the appropriate RPC URL based on chainId
    let rpcUrl = "";
    switch (chainId) {
      case 1: // Ethereum mainnet
        rpcUrl = process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/your-api-key";
        break;
      case 11155111: // Sepolia
        rpcUrl = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/your-api-key";
        break;
      case 42161: // Arbitrum
        rpcUrl = process.env.ARBITRUM_RPC_URL || "https://arb-mainnet.g.alchemy.com/v2/your-api-key";
        break;
      default:
        return res.status(400).json({ error: "Unsupported chain ID" });
    }

    if (!rpcUrl) {
      return res.status(500).json({ error: "RPC URL not configured for this chain" });
    }

    const web3 = new Web3(rpcUrl);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Verify the account matches the userAddress
    if (account.address.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(400).json({ error: "Private key does not match user address" });
    }

    const gasPrice = BigInt(await web3.eth.getGasPrice());
    const gasLimit = BigInt(1_000_000);
    const balance = BigInt(await web3.eth.getBalance(account.address));
    const valueBigInt = BigInt(value);

    const required = valueBigInt + gasPrice * gasLimit;
    if (balance < required) {
      return res.status(400).json({ 
        error: `Insufficient balance. Need ${required}, have ${balance}` 
      });
    }

    const txn = {
      from: account.address,
      to: web3.utils.toChecksumAddress(routerAddress),
      data: calldata,
      gas: Number(gasLimit),
      gasPrice: web3.utils.toHex(gasPrice),
      nonce: await web3.eth.getTransactionCount(account.address),
      value: web3.utils.toHex(valueBigInt),
      chainId,
    };

    const signed = await account.signTransaction(txn);
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

    res.json({
      success: true,
      data: {
        transactionHash: receipt.transactionHash,
        status: receipt.status,
        gasUsed: receipt.gasUsed,
        blockNumber: receipt.blockNumber,
      }
    });
  } catch (error: any) {
    console.error("Swap execution error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Get supported chains
app.get("/api/chains", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: "Ethereum", chainId: "ethereum", nativeCurrency: "ETH" },
      { id: 11155111, name: "Sepolia", chainId: "sepolia", nativeCurrency: "ETH" },
      { id: 42161, name: "Arbitrum", chainId: "arbitrum", nativeCurrency: "ETH" },
      { id: 8453, name: "Base", chainId: "base", nativeCurrency: "ETH" },
      { id: 100, name: "Gnosis", chainId: "gnosis", nativeCurrency: "xDAI" },
      { id: 137, name: "Polygon", chainId: "polygon", nativeCurrency: "MATIC" },
      { id: 10, name: "Optimism", chainId: "optimism", nativeCurrency: "ETH" },
    ]
  });
});

// Get supported tokens for a chain
app.get("/api/tokens/:chainId", (req, res) => {
  const { chainId } = req.params;
  
  const tokens = {
    ethereum: [
      { symbol: "ETH", name: "Ethereum", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
      { symbol: "USDT", name: "Tether USD", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
      { symbol: "WETH", name: "Wrapped Ether", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
    ],
    sepolia: [
      { symbol: "ETH", name: "Ethereum", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", decimals: 6 },
    ],
    arbitrum: [
      { symbol: "ETH", name: "Ethereum", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", decimals: 6 },
    ],
    base: [
      { symbol: "ETH", name: "Ethereum", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
    ],
    gnosis: [
      { symbol: "xDAI", name: "xDAI", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", decimals: 6 },
    ],
    polygon: [
      { symbol: "MATIC", name: "Polygon", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
    ],
    optimism: [
      { symbol: "ETH", name: "Ethereum", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
      { symbol: "USDC", name: "USD Coin", address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", decimals: 6 },
    ],
  };

  const chainTokens = tokens[chainId as keyof typeof tokens];
  if (!chainTokens) {
    return res.status(400).json({ error: "Unsupported chain" });
  }

  res.json({
    success: true,
    data: chainTokens
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});