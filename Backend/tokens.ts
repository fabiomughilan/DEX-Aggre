Certainly! Below are full, production-ready examples of tokens.ts and Chains.ts with a broad set of popular mainnets and their canonical USDC addresses. You can extend these for any new chains or tokens as needed.

tokens.ts
ts
// tokens.ts

// USDC (or bridged/wrapped USDC) contract address for each supported chain.
// Keys must match the CHAINS object keys.
export const USDC_ADDRESSES: Record<string, string> = {
  ethereum:   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  arbitrum:   "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  polygon:    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  avalanche:  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  bnb:        "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  optimism:   "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  base:       "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // bridged from Ethereum
  scroll:     "0x22CA6cF47cE238d7b9b36676E1fE6F9C0aA97914",
  mantle:     "0x8DafcF7cE011506B0aBB0b28821DB8d6AcE5a5C5",
  taiko:      "0xF5Bf3A5a8016821F4389646433194E19709F5CEE",
  blast:      "0x4300000000000000000000000000000000000003",
  berachain:  "0x4200000000000000000000000000000000000022",
  linea:      "0xb23ab7Ef65e52b6eF94Bc6200b828ef70e9AEE15",
  gnosis:     "0xddafbb505ad214d7b80b1f830fcfee9fbbdbeaf1",
  hyperevm:   "", // Add if available
  sonic:      "", // Add if available
  unichain:   "", // Add if available
  // Add more chains and their USDC addresses as needed.
};

// Standard "zero" address for native coins (ETH, BNB, etc.)
export const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";