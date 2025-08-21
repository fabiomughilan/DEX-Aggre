// ===========================
// GlueX Router DEX Aggregation
// ===========================

import { Web3 } from "web3";
import axios from "axios";

// ===========================
// 🔹 CONFIGURATION
// ===========================
const API_KEY = "RSvguRUV5uE1lSJk78tHKxggOHt65noY";           // Get from GlueX
const UNIQUE_PID = "f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d";     // Unique process ID (tracking)
const QUOTE_ENDPOINT = "https://router.gluex.xyz/v1/quote";
const RPC_URL = ""; // Ethereum RPC
const PRIVATE_KEY = "";  // Your wallet private key

// ===========================
// 🔹 TOKENS
// ===========================
const NATIVE_TOKEN_ADDRESS =
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Special address for ETH

const TOKEN_IN = NATIVE_TOKEN_ADDRESS; // Swap ETH...
const TOKEN_OUT = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // ...to USDC
const INPUT_AMOUNT = BigInt("10000000000000000"); // 0.01 ETH

// ===========================
// 🔹 INIT WEB3
// ===========================
const web3 = new Web3(RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
const COMPUTATION_UNITS = 1000000;

// ===========================
// 🔹 FETCH QUOTE
// ===========================
const fetchQuote = async (body, headers) => {
    console.log("Fetching best quote from GlueX Router...");
    const response = await axios.post(QUOTE_ENDPOINT, body, { headers });
    return response.data;
};

// ===========================
// 🔹 EXECUTE TRANSACTION
// ===========================
const executeTransaction = async (calldata, routerAddress, account, value = BigInt(0)) => {
    console.log(`🔍 Debug: Account address: ${account.address}`);
    console.log(`🔍 Debug: Router address: ${routerAddress}`);
    console.log(`🔍 Debug: Value to send: ${value.toString()}`);
    
    const gasPrice = BigInt(await web3.eth.getGasPrice());
    const gasLimit = BigInt(COMPUTATION_UNITS);
    const balance = BigInt(await web3.eth.getBalance(account.address));
  
    console.log(`🔍 Debug: Gas price: ${gasPrice.toString()}`);
    console.log(`🔍 Debug: Gas limit: ${gasLimit.toString()}`);
    console.log(`🔍 Debug: Account balance: ${balance.toString()}`);
    
    const required = value + gasPrice * gasLimit;
    if (balance < required) {
      throw new Error(
        `Insufficient balance. Need ${required}, but only have ${balance}`
      );
    }
  
    const txn = {
      from: account.address,
      to: web3.utils.toChecksumAddress(routerAddress),
      data: calldata,
      gas: Number(gasLimit),                // ✅ number
      gasPrice: web3.utils.toHex(gasPrice), // ✅ hex string
      nonce: await web3.eth.getTransactionCount(account.address),
      value: web3.utils.toHex(value),       // ✅ hex string (instead of BigInt)
      chainId: 11155111, // Sepolia testnet
    };
    
    console.log(`🔍 Debug: Transaction object:`, txn);
  
    const signedTxn = await account.signTransaction(txn);
    console.log("Broadcasting transaction...");
    const receipt = await web3.eth.sendSignedTransaction(signedTxn.rawTransaction);
    console.log(`✅ Transaction Hash: ${receipt.transactionHash}`);
    
    // Print block explorer URL
    const chainId = txn.chainId;
    let explorerUrl;
    if (chainId === 11155111) {
        explorerUrl = `https://sepolia.etherscan.io/tx/${receipt.transactionHash}`;
    } else if (chainId === 1) {
        explorerUrl = `https://etherscan.io/tx/${receipt.transactionHash}`;
    } else if (chainId === 137) {
        explorerUrl = `https://polygonscan.com/tx/${receipt.transactionHash}`;
    } else if (chainId === 56) {
        explorerUrl = `https://bscscan.com/tx/${receipt.transactionHash}`;
    } else {
        explorerUrl = `Chain ID ${chainId} - Check your preferred explorer`;
    }
    
    console.log(`🔍 Block Explorer: ${explorerUrl}`);
    return receipt;
};


// ===========================
// 🔹 MAIN FUNCTION
// ===========================
const main = async () => {
    const headers = { "x-api-key": API_KEY };
    const body = {
        chainID: "sepolia",
        userAddress: account.address,
        outputReceiver: account.address,
        uniquePID: UNIQUE_PID,
        inputToken: TOKEN_IN,
        outputToken: TOKEN_OUT,
        inputAmount: INPUT_AMOUNT.toString(), // Must be string for JSON
        isPermit2: false,
    };

    console.log("\n=============================");
    console.log(" Step 1: Fetching Quote...");
    console.log("=============================\n");

    const quoteData = await fetchQuote(body, headers);

    if (quoteData.statusCode !== 200) {
        console.log("❌ Error fetching quote:", quoteData);
        return;
    }

    console.log("✅ Quote received:");
    console.log(JSON.stringify(quoteData.result, null, 2));

    const routerAddress = quoteData.result.router;
    const calldata = quoteData.result.calldata;
    
    console.log(`🔍 Debug: Router address from quote: ${routerAddress}`);
    console.log(`🔍 Debug: Calldata length: ${calldata ? calldata.length : 'undefined'}`);
    console.log(`🔍 Debug: Input amount: ${INPUT_AMOUNT.toString()}`);
    console.log(`🔍 Debug: Chain ID being used: 11155111 (Sepolia)`);



    console.log("\n=============================");
    console.log(" Step 2: Executing Swap...");
    console.log("=============================\n");

    const receipt = await executeTransaction(
        calldata,
        routerAddress,
        account,
        INPUT_AMOUNT
    );

    console.log("\n✅ Transaction confirmed. Receipt:");
    console.log(receipt);
};

// ===========================
// 🔹 RUN SCRIPT
// ===========================
main().catch(console.error);
