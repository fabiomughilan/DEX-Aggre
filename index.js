import axios from "axios";

async function getQuote() {
  try {
    const response = await axios.post(
      "https://router.gluex.xyz/v1/quote",
      {
        inputToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH native
        outputToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC mainnet
        inputAmount: "10000000000000000", // must be in wei (check units!)
        userAddress: "0x61e42f21d7E1bd841EC1aa6923db7C2477c7ea77",
        outputReceiver: "0x9874Ca67eDAd959008810Ca4126a8412b6813fcD",
        chainID: "ethereum", // Ethereum mainnet
        uniquePID: "f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d",
        isPermit2: false,
      },
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": "RSvguRUV5uE1lSJk78tHKxggOHt65noY",
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

getQuote();