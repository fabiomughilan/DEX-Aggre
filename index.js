import axios from "axios";

async function getQuote() {
  try {
    const response = await axios.post(
      "https://router.gluex.xyz/v1/quote",
      {
        inputToken: "0xd38E5c25935291fFD51C9d66C3B7384494bb099A",
        outputToken: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        inputAmount: "100000000",
        userAddress: "0x61e42f21d7E1bd841EC1aa6923db7C2477c7ea77",
        outputReceiver: "0x9874Ca67eDAd959008810Ca4126a8412b6813fcD",
        chainID: "sepolia",
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
    console.error("Error:", error.message);
  }
}

// Call the function
getQuote();