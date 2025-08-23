import { useState, useEffect } from "react";
import { ArrowDownUp, Settings, Zap, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import TokenSelector from "./TokenSelector";
import ChainSelector from "./ChainSelector";

import { Input } from "@/components/ui/input";
import { useSwap } from "@/hooks/useSwap";
import { useToast } from "@/hooks/use-toast";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon?: string;
  usdPrice?: number;
}

interface Chain {
  id: number;
  name: string;
  chainId: string;
  nativeCurrency: string;
}

import ethereum from "../../../Backend/public/Ethereum.png"
import arbitrium from "../../../Backend/public/arbitrium.png"
import sonic from "../../../Backend/public/sonic.png"

// Quick chain icons (update logos as needed)
const chainQuickList = [
  { key: "ethereum", logo: ethereum, id: 1 },
  { key: "arbitrum", logo: arbitrium, id: 42161 },
  { key: "base", logo: sonic, id: 8453 },
  { key: "gnosis", logo: sonic, id: 100 },
  { key: "polygon", logo: sonic, id: 137 },
  { key: "optimism", logo: sonic, id: 10 },
];

// Stub: Replace with a pricing hook/API
const getTokenPrice = (token: Token) => token?.usdPrice ?? 1.0;

const SwapCard = () => {
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();
  const [selectedChain, setSelectedChain] = useState<string>("ethereum");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const { toast } = useToast();
  const { 
    isLoading, 
    error, 
    quote, 
    conversionRate,
    getQuote, 
    getConversionRate,
    executeSwap, 
    getSupportedTokens,
    clearError,
    clearQuote,
    clearConversionRate
  } = useSwap();

  // Load available tokens when chain changes
  useEffect(() => {
    const loadTokens = async () => {
      const tokens = await getSupportedTokens(selectedChain);
      setAvailableTokens(tokens);
      
      // Set default tokens if none selected
      if (!fromToken && tokens.length > 0) {
        setFromToken(tokens[0]); // Native token (ETH, MATIC, etc.)
      }
      if (!toToken && tokens.length > 1) {
        setToToken(tokens[1]); // USDC
      }
    };

    loadTokens();
  }, [selectedChain, getSupportedTokens]);

  // Fetch conversion rate when tokens or chain changes
  useEffect(() => {
    if (fromToken && toToken && selectedChain) {
      const fetchRate = async () => {
        setIsLoadingRate(true);
        try {
          await getConversionRate(fromToken, toToken, selectedChain, selectedChain);
        } catch (err) {
          console.error('Failed to fetch conversion rate:', err);
        } finally {
          setIsLoadingRate(false);
        }
      };

      fetchRate();
    } else {
      clearConversionRate();
    }
  }, [fromToken, toToken, selectedChain, getConversionRate, clearConversionRate]);

  // Calculate TO amount when FROM amount changes
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && conversionRate && fromToken && toToken) {
      setIsCalculating(true);
      
      // Calculate the output amount based on conversion rate
      const inputAmount = parseFloat(fromAmount);
      const outputAmount = inputAmount * conversionRate;
      
      // Format the output amount based on token decimals
      const formattedOutput = outputAmount.toFixed(toToken.decimals === 18 ? 6 : 2);
      setToAmount(formattedOutput);
      
      setIsCalculating(false);
    } else if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount("0");
    }
  }, [fromAmount, conversionRate, fromToken, toToken]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please ensure all fields are filled with valid amounts",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, show a success message
    // In a real implementation, this would execute the actual swap
    toast({
      title: "Swap Initiated",
      description: `Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
    });
    
    // Reset form after successful swap
    setTimeout(() => {
      setFromAmount("");
      setToAmount("");
      clearQuote();
    }, 2000);
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

  const canSwap = fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && !isLoading;

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
                    availableTokens={availableTokens}
                    hideLabel
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
                <div className="text-3xl font-bold text-white/30 flex-1 select-none">
                  {isCalculating ? (
                    <Loader2 className="h-8 w-8 animate-spin text-[#23b68c]" />
                  ) : (
                    toAmount || "0"
                  )}
                </div>
                <div className="ml-3">
                  <TokenSelector
                    selectedToken={toToken}
                    onTokenSelect={setToToken}
                    availableTokens={availableTokens}
                    hideLabel
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Rate Display */}
          {fromToken && toToken && (
            <div className="mt-4 p-3 bg-[#23b68c1a] rounded-lg border border-[#23b68c33]">
              <div className="text-sm text-[#23b68c]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Conversion Rate</span>
                </div>
                {isLoadingRate ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading rate...</span>
                  </div>
                ) : conversionRate ? (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>1 {fromToken.symbol} =</span>
                      <span className="font-semibold">{conversionRate.toFixed(6)} {toToken.symbol}</span>
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>1 {toToken.symbol} =</span>
                      <span>{(1 / conversionRate).toFixed(6)} {fromToken.symbol}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs opacity-70">
                    Rate not available for this token pair
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Swap Button */}
          <div className="mt-7">
            <button 
              onClick={handleSwap}
              disabled={!canSwap || isLoading}
              className={`${swapButtonClass} ${!canSwap ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Zap className="h-5 w-5" />
              )}
              {isLoading ? 'Processing...' : 'Swap'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SwapCard;
