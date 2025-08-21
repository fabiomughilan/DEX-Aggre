import axios, { AxiosResponse } from "axios";

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

interface QuoteResponse {
  statusCode?: number;
  error?: string;
  [key: string]: any; // allow extra fields from API
}

async function getQuote(): Promise<void> {
  try {
    const payload: QuoteRequest = {
      inputToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH native
      outputToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC mainnet
      inputAmount: "10000000000000000", // 0.01 ETH in wei
      userAddress: "0x61e42f21d7E1bd841EC1aa6923db7C2477c7ea77",
      outputReceiver: "0x9874Ca67eDAd959008810Ca4126a8412b6813fcD",
      chainID: "ethereum", // GlueX expects string chain ID (like "ethereum", "arbitrum", etc.)
      uniquePID:
        "f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d",
      isPermit2: false,
    };

    const response: AxiosResponse<QuoteResponse> = await axios.post(
      "https://router.gluex.xyz/v1/quote",
      payload,
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": "RSvguRUV5uE1lSJk78tHKxggOHt65noY",
        },
      }
    );

    console.log("Quote Response:", response.data);
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
}

getQuote();