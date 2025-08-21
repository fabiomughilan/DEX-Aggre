import fetch from "node-fetch";

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

async function fetchTokenPrice(requests: TokenPriceRequest[]): Promise<TokenPriceResponse[]> {
  const response = await fetch("https://exchange-rates.gluex.xyz/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requests),
  });

  if (!response.ok) {
    throw new Error(`Error fetching price: ${response.statusText}`);
  }

  const data: TokenPriceResponse[] = await response.json();
  return data;
}

// Example: Fetch USDC → USDT price
(async () => {
  try {
    const priceData = await fetchTokenPrice([
  // Ethereum Mainnet
  {
    domestic_blockchain: "ethereum",
    domestic_token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
    foreign_blockchain: "ethereum",
    foreign_token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  },
  {
    domestic_blockchain: "ethereum",
    domestic_token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
    foreign_blockchain: "ethereum",
    foreign_token: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  },

  // Arbitrum Mainnet
  {
    domestic_blockchain: "arbitrum",
    domestic_token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
    foreign_blockchain: "arbitrum",
    foreign_token: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
  },
  {
    domestic_blockchain: "arbitrum",
    domestic_token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
    foreign_blockchain: "arbitrum",
    foreign_token: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // USDT
  },
]);



    console.log("Price Data:", priceData);

    if (priceData.length === 0) {
      console.error("No price data found for this pair.");
      return;
    }

    console.log(`1 USDC ≈ ${priceData[0].price} USDT`);
  } catch (err) {
    console.error("Error:", err);
  }
})();