import ethereumLogo from "./public/Ethereum.png"
import arbitriumLogo from "./public/arbitrium.png"
import sonicLogo from "./public/sonic.png"
export const CHAINS = {
    ethereum: {
      id: 1,
      name: "Ethereum",
      rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY", // or Infura, QuickNode
      explorer: "https://etherscan.io",
      logo:ethereumLogo
    },
    arbitrum: {
      id: 42161,
      name: "Arbitrum One",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      explorer: "https://arbiscan.io",
      logo:arbitriumLogo
    },
    avalanche: {
      id: 43114,
      name: "Avalanche C-Chain",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      explorer: "https://snowtrace.io",
      logo:ethereumLogo
    },
    base: {
      id: 8453,
      name: "Base",
      rpcUrl: "https://mainnet.base.org",
      explorer: "https://basescan.org",
      logo:ethereumLogo
    },
    berachain: {
      id: 80094,
      name: "Berachain",
      rpcUrl: "https://rpc.berachain.com", // Replace when mainnet RPC official
      explorer: "https://berascan.com",
      logo:ethereumLogo
    },
    blast: {
      id: 81457,
      name: "Blast",
      rpcUrl: "https://rpc.blast.io",
      explorer: "https://blastscan.io",
      logo:ethereumLogo
    },
    bnb: {
      id: 56,
      name: "BNB Smart Chain",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      explorer: "https://bscscan.com",
      logo:ethereumLogo
    },
    gnosis: {
      id: 100,
      name: "Gnosis Chain",
      rpcUrl: "https://rpc.gnosischain.com",
      explorer: "https://gnosisscan.io",
      logo:ethereumLogo
    },
    hyperevm: {
      id: 999,
      name: "HyperEVM",
      rpcUrl: "https://rpc.hyperevm.io",
      explorer: "https://hyperscan.io",
      logo:arbitriumLogo
    },
    linea: {
      id: 59144,
      name: "Linea",
      rpcUrl: "https://rpc.linea.build",
      explorer: "https://lineascan.build",
      logo:arbitriumLogo
    },
    mantle: {
      id: 5000,
      name: "Mantle",
      rpcUrl: "https://rpc.mantle.xyz",
      explorer: "https://explorer.mantle.xyz",
      logo:sonicLogo
    },
    optimism: {
      id: 10,
      name: "Optimism",
      rpcUrl: "https://mainnet.optimism.io",
      explorer: "https://optimistic.etherscan.io",
      logo:arbitriumLogo
    },
    polygon: {
      id: 137,
      name: "Polygon",
      rpcUrl: "https://polygon-rpc.com",
      explorer: "https://polygonscan.com",
      logo:sonicLogo
    },
    scroll: {
      id: 534352,
      name: "Scroll",
      rpcUrl: "https://rpc.scroll.io",
      explorer: "https://scrollscan.com",
      logo:sonicLogo
    },
    sonic: {
      id: 146,
      name: "Sonic",
      rpcUrl: "https://rpc.soniclabs.com",
      explorer: "https://sonicscan.io",
      logo:arbitriumLogo
    },
    
    taiko: {
      id: 167000,
      name: "Taiko",
      rpcUrl: "https://rpc.mainnet.taiko.xyz",
      explorer: "https://taikoscan.io",
      logo:sonicLogo
    },
    unichain: {
      id: 130,
      name: "Unichain",
      rpcUrl: "https://rpc.unichain.org",
      explorer: "https://uniscan.org",
      logo:sonicLogo
    },
  };
  