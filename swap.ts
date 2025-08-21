// ===========================
// GlueX Router DEX Aggregation (TypeScript)
// ===========================

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
const UNIQUE_PID =
  "f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d";
const QUOTE_ENDPOINT = "https://router.gluex.xyz/v1/quote";
const RPC_URL = process.env.RPC_URL ?? "";
const PRIVATE_KEY = (process.env.PRIVATE_KEY ?? "").startsWith("0x")
  ? (process.env.PRIVATE_KEY as string)
  : `0x${process.env.PRIVATE_KEY ?? ""}`;

// -------- Tokens
const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // ETH native
const TOKEN_IN = NATIVE_TOKEN_ADDRESS;
// NOTE: This is USDC **Sepolia**. For mainnet use: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
const TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const INPUT_AMOUNT = BigInt("10000000000000000"); // 0.01 ETH

// -------- Init Web3
if (!RPC_URL) throw new Error("RPC_URL missing");
if (!API_KEY) throw new Error("GLUEX_API_KEY missing");
if (!PRIVATE_KEY || PRIVATE_KEY.length !== 66)
  throw new Error("Invalid PRIVATE_KEY (must be 0x-prefixed 32-byte hex)");

const web3 = new Web3(RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY) as unknown as IWeb3Account;

const COMPUTATION_UNITS = BigInt(1_000_00); // keep modest; adjust as needed

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
  const gasPrice = BigInt(await web3.eth.getGasPrice());
  const gasLimit = BigInt(1_000_000);
  const balance = BigInt(await web3.eth.getBalance(account.address));

  const required = value + gasPrice * gasLimit;
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

  const signed = await account.signTransaction(txn);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return receipt;
};

// -------- Main
async function main() {
  const headers = { "x-api-key": API_KEY };
  const body = {
    chainID: "ethereum", // use "arbitrum" for Arbitrum
    userAddress: account.address,
    outputReceiver: account.address,
    uniquePID: UNIQUE_PID,
    inputToken: TOKEN_IN,
    outputToken: TOKEN_OUT,
    inputAmount: INPUT_AMOUNT.toString(),
    isPermit2: false,
  };

  const quote = await fetchQuote(body, headers);
  if (quote.statusCode !== 200 || !quote.result) {
    console.error("Quote error:", quote);
    return;
  }

  const chainId = 1; // 1=Ethereum, 42161=Arbitrum
  const receipt = await executeTransaction(
    quote.result.calldata,
    quote.result.router,
    INPUT_AMOUNT,
    chainId
  );

  console.log("Tx hash:", receipt.transactionHash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});