import { useState } from "react";
import { ArrowDownUp, Settings, Zap } from "lucide-react";
import TokenSelector from "./TokenSelector";
import ChainSelector from "./ChainSelector";
import { DexButton } from "@/components/ui/dex-button";
import { Input } from "@/components/ui/input";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  usdPrice?: number;
}
import ethereum from "../../../Backend/public/Ethereum.png"
import arbitrium from "../../../Backend/public/arbitrium.png"
import sonic from "../../../Backend/public/sonic.png"
// Quick chain icons (update logos as needed)
const chainQuickList = [
  { key: "ethereum", logo: ethereum },
  { key: "arbitrum", logo: arbitrium },
  { key: "base", logo: sonic},
  { key: "gnosis", logo: sonic },
  { key: "polygon", logo: sonic },
  { key: "optimism", logo: sonic },
];

// Stub: Replace with a pricing hook/API
const getTokenPrice = (token: Token) => token?.usdPrice ?? 1.0;

const SwapCard = () => {
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();
  const [selectedChain, setSelectedChain] = useState<string>("ethereum");
  const [fromAmount, setFromAmount] = useState("");

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  // Animated gradient classes for the swap button
  const swapButtonClass =
    "w-full h-14 text-lg font-semibold flex items-center justify-center gap-2 " +
    "bg-[linear-gradient(90deg,#23b68c_0%,#55e6ff_50%,#2ec9ff_100%)] " +
    "bg-[length:200%_200%] animate-gradient-x rounded-xl shadow-xl " +
    "hover:brightness-110 transition-all duration-200";

  // Fiat (USD) calculation - replace with live quote if needed
  const fiatAmount =
    fromAmount && fromToken ? (
      <span className="text-xs text-dex-text-muted animate-fadeIn">
        ≈ ${(parseFloat(fromAmount) * getTokenPrice(fromToken)).toFixed(2)} USD
      </span>
    ) : null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative p-1 bg-gradient-to-br from-[#23b68c4d] to-[#15375080] rounded-2xl shadow-[0_10px_40px_#23b68c33]">
        <div className="bg-[rgba(10,15,25,0.77)] backdrop-blur-2xl rounded-2xl p-6">

          {/* Header row with settings */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-wide text-white drop-shadow">Swap</h2>
            <DexButton variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </DexButton>
          </div>

          {/* Quick Chain Selector Row with animation */}
          <div className="flex items-center gap-4 mb-7">
            {chainQuickList.map((c) => (
              <button
                key={c.key}
                aria-label={c.key}
                onClick={() => setSelectedChain(c.key)}
                className={`rounded-xl bg-black/60 border-2
                  ${selectedChain === c.key
                    ? "border-[#23b68c] ring-2 ring-[#23b68c44] scale-105"
                    : "border-transparent"}
                  shadow hover:scale-105 p-2 transition-all duration-100 relative group`}
              >
                <img src={c.logo} alt={c.key} className="w-8 h-8 rounded-lg" />
                {selectedChain === c.key && (
                  <span className="absolute inset-0 rounded-xl animate-glow" />
                )}
              </button>
            ))}
            <div className="flex-1" />
            {/* Optional full selector dropdown:
            <ChainSelector label="" selectedChainKey={selectedChain} onChainSelect={setSelectedChain} compact />
            */}
          </div>

          {/* FROM FIELD */}
          <div className="flex items-center rounded-xl p-4 bg-black/50 border border-border mb-2 shadow-sm">
            <div className="flex-1 flex flex-col">
              <span className="text-sm text-white/60 mb-0.5 font-medium">From</span>
              <div className="flex items-center">
                <Input
                  type="number"
                  inputMode="decimal"
                  autoComplete="off"
                  min="0"
                  spellCheck={false}
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="
                    no-spinner
                    bg-transparent text-3xl font-bold border-none focus:outline-none w-full
                    text-white placeholder:text-white/30 transition-all duration-150
                    focus:shadow-[0_0_16px_0_#23b68c44]
                  "
                />
                <div className="ml-3">
                  <TokenSelector
                    selectedToken={fromToken}
                    onTokenSelect={setFromToken}
                    hideLabel // Use compact pill
                  />
                </div>
              </div>
              {fiatAmount}
            </div>
          </div>

          {/* SWAP BUTTON (animated arrow) */}
          <div className="flex justify-center mb-2 mt-1">
            <div className="rounded-full bg-[#232942] shadow transition-all hover:scale-110">
              <DexButton
                variant="ghost"
                size="icon"
                onClick={handleSwapTokens}
                className="h-9 w-9 rounded-full"
              >
                <ArrowDownUp className="h-4 w-4 text-[#23b68c] animate-bounce-swap" />
              </DexButton>
            </div>
          </div>

          {/* TO FIELD */}
          <div className="flex items-center rounded-xl p-4 bg-black/50 border border-border mt-2 shadow-sm">
            <div className="flex-1 flex flex-col">
              <span className="text-sm text-white/60 mb-0.5 font-medium">To</span>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-white/30 flex-1 select-none">0</div>
                <div className="ml-3">
                  <TokenSelector
                    selectedToken={toToken}
                    onTokenSelect={setToToken}
                    hideLabel
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Swap / Connect Wallet Button */}
          <div className="mt-7">
            <button className={swapButtonClass}>
              <Zap className="h-5 w-5" />
              Connect wallet
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SwapCard;
