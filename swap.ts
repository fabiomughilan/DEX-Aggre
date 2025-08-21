// ===========================
// GlueX Router DEX Aggregation (TypeScript)
// ===========================

import "dotenv/config";
import Web3 from "web3";
import axios, { AxiosResponse } from "axios";

// -------- Types
interface GlueXQuote {
  statusCode: number;
  result?: { router: string; calldata: string };
  error?: string;
}

interface IWeb3Account {
  address: string;
  signTransaction(
    tx: {
      from: string;
      to: string;
      data: string;
      gas: number;
      gasPrice: string;
      nonce: number;
      value: string;
      chainId: number;
    }
  ): Promise<{ rawTransaction: string }>;
}

// -------- Config (fill via env or literals; PRIVATE_KEY must start with 0x)
const API_KEY = process.env.GLUEX_API_KEY ?? "";
const UNIQUE_PID ="f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d";
const QUOTE_ENDPOINT = "https://router.gluex.xyz/v1/quote";
const RPC_URL = process.env.RPC_URL ?? "";
const PRIVATE_KEY = (process.env.PRIVATE_KEY ?? "").startsWith("0x")
  ? (process.env.PRIVATE_KEY as string)
  : `0x${process.env.PRIVATE_KEY ?? ""}`;

// -------- Tokens
const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // ETH native
const TOKEN_IN = NATIVE_TOKEN_ADDRESS;
// Map chainId -> USDC token address
function getUsdcAddress(chainId: number): string {
  switch (chainId) {
    case 1:
      return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Mainnet USDC
    case 11155111:
      return "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC
    default:
      // Fallback: mainnet USDC, but caller should override per-chain
      return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  }
}
const INPUT_AMOUNT = BigInt("10000000000000000"); // 0.01 ETH

// -------- Init Web3
if (!RPC_URL) throw new Error("RPC_URL missing");
if (!API_KEY) throw new Error("GLUEX_API_KEY missing");
if (!PRIVATE_KEY || PRIVATE_KEY.length !== 66)
  throw new Error("Invalid PRIVATE_KEY (must be 0x-prefixed 32-byte hex)");

const web3 = new Web3(RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY) as unknown as IWeb3Account;

const COMPUTATION_UNITS = BigInt(1_000_000); // keep modest; adjust as needed

// -------- Helpers
const fetchQuote = async (
  body: Record<string, unknown>,
  headers: Record<string, string>
): Promise<GlueXQuote> => {
  const res: AxiosResponse<GlueXQuote> = await axios.post(QUOTE_ENDPOINT, body, { headers });
  return res.data;
};

const executeTransaction = async (
  calldata: string,
  routerAddress: string,
  value: bigint,
  chainId: number
) => {
  console.log("\n=== Debug: Preparing transaction ===");
  console.log("Account:", account.address);
  console.log("Router:", routerAddress);
  console.log("Calldata length:", calldata?.length ?? 0);
  console.log("Value (wei):", value.toString());
  console.log("ChainId:", chainId);

  const gasPrice = BigInt(await web3.eth.getGasPrice());
  const gasLimit = BigInt(1_000_000);
  const balance = BigInt(await web3.eth.getBalance(account.address));

  console.log("Gas price (wei):", gasPrice.toString());
  console.log("Gas limit:", gasLimit.toString());
  console.log("Account balance (wei):", balance.toString());

  const required = value + gasPrice * gasLimit;
  console.log("Required (wei):", required.toString());
  if (balance < required) {
    throw new Error(`Insufficient balance. Need ${required}, have ${balance}`);
  }

  const txn = {
    from: account.address,
    to: web3.utils.toChecksumAddress(routerAddress),
    data: calldata,
    gas: Number(gasLimit),
    gasPrice: web3.utils.toHex(gasPrice),
    nonce: await web3.eth.getTransactionCount(account.address),
    value: web3.utils.toHex(value),
    chainId,
  };

  console.log("Txn object:", txn);
  const signed = await account.signTransaction(txn);
  console.log("Signed, broadcasting...");
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log("Receipt status:", receipt.status);
  return receipt;
};

// -------- Main
async function main() {
  const headers = { "x-api-key": API_KEY };
  const rpcChainId = await web3.eth.getChainId();
  const chainForApi = rpcChainId === 1 ? "ethereum" : rpcChainId === 11155111 ? "sepolia" : String(rpcChainId);
  const tokenOut = getUsdcAddress(rpcChainId);
  console.log("Using RPC chainId:", rpcChainId, "-> API chain:", chainForApi);
  console.log("Account address:", account.address);
  const body = {
    chainID: chainForApi,
    userAddress: account.address,
    outputReceiver: account.address,
    uniquePID: UNIQUE_PID,
    inputToken: TOKEN_IN,
    outputToken: tokenOut,
    inputAmount: INPUT_AMOUNT.toString(),
    isPermit2: false,
  };

  console.log("Request body:", body);
  const quote = await fetchQuote(body, headers);
  if (quote.statusCode !== 200 || !quote.result) {
    console.error("Quote error:", quote);
    return;
  }

  console.log("Quote received. Router:", quote.result.router);
  console.log("Calldata length:", quote.result.calldata?.length ?? 0);
  const chainId = rpcChainId;
  const receipt = await executeTransaction(
    quote.result.calldata,
    quote.result.router,
    INPUT_AMOUNT,
    chainId
  );

  console.log("Tx hash:", receipt.transactionHash);
  // Explorer URLs
  const txUrl = ((): string => {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/tx/${receipt.transactionHash}`;
      case 11155111:
        return `https://sepolia.etherscan.io/tx/${receipt.transactionHash}`;
      default:
        return `chainId ${chainId} - open tx ${receipt.transactionHash} on your explorer`;
    }
  })();
  const holderUrl = ((): string => {
    const token = tokenOut;
    const addr = account.address;
    switch (chainId) {
      case 1:
        return `https://etherscan.io/token/${token}?a=${addr}`;
      case 11155111:
        return `https://sepolia.etherscan.io/token/${token}?a=${addr}`;
      default:
        return `chainId ${chainId} - open token ${token} for ${addr}`;
    }
  })();
  console.log("Explorer:", txUrl);
  console.log("USDC holder:", holderUrl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});