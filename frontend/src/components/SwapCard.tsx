import { useState, useEffect } from "react";
import { ArrowDownUp, Settings, Zap, Loader2, AlertCircle } from "lucide-react";
import TokenSelector from "./TokenSelector";
import ChainSelector from "./ChainSelector";
import { DexButton } from "@/components/ui/dex-button";
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
  const [userAddress, setUserAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const { toast } = useToast();
  const { 
    isLoading, 
    error, 
    quote, 
    getQuote, 
    executeSwap, 
    getSupportedTokens,
    clearError,
    clearQuote 
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

  // Update quote when input changes
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && userAddress) {
      const fetchQuote = async () => {
        const quoteData = await getQuote(fromToken, toToken, fromAmount, userAddress, selectedChain);
        if (quoteData) {
          // Convert output amount from wei to human readable
          const outputAmount = parseFloat(quoteData.outputAmount) / Math.pow(10, toToken.decimals);
          setToAmount(outputAmount.toString());
        }
      };

      // Debounce quote requests
      const timeoutId = setTimeout(fetchQuote, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setToAmount("0");
      clearQuote();
    }
  }, [fromToken, toToken, fromAmount, userAddress, selectedChain, getQuote, clearQuote]);

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

  const handleConnectWallet = () => {
    // In a real app, this would connect to MetaMask or other wallet
    // For demo purposes, we'll use a simple input
    const address = prompt("Enter your wallet address (0x...):");
    const key = prompt("Enter your private key (0x...):");
    
    if (address && key) {
      setUserAddress(address);
      setPrivateKey(key);
      setIsWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }
  };

  const handleSwap = async () => {
    if (!quote || !fromToken || !toToken || !userAddress || !privateKey) {
      toast({
        title: "Error",
        description: "Please ensure all fields are filled and wallet is connected",
        variant: "destructive",
      });
      return;
    }

    const chainInfo = chainQuickList.find(c => c.key === selectedChain);
    if (!chainInfo) {
      toast({
        title: "Error",
        description: "Invalid chain selected",
        variant: "destructive",
      });
      return;
    }

    // Convert amount to wei
    const valueWei = (parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)).toString();

    const result = await executeSwap(
      quote.calldata,
      quote.router,
      valueWei,
      chainInfo.id,
      userAddress,
      privateKey
    );

    if (result) {
      toast({
        title: "Swap Successful!",
        description: `Transaction: ${result.transactionHash.slice(0, 6)}...${result.transactionHash.slice(-4)}`,
      });
      
      // Reset form
      setFromAmount("");
      setToAmount("");
      clearQuote();
    }
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

  const canSwap = fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && 
                  userAddress && privateKey && quote && !isLoading;

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
                  {isLoading ? (
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

          {/* Quote Info */}
          {quote && (
            <div className="mt-4 p-3 bg-[#23b68c1a] rounded-lg border border-[#23b68c33]">
              <div className="text-sm text-[#23b68c]">
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>1 {fromToken?.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken?.symbol}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Router:</span>
                  <span className="text-xs">{quote.router.slice(0, 6)}...{quote.router.slice(-4)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Swap / Connect Wallet Button */}
          <div className="mt-7">
            {!isWalletConnected ? (
              <button 
                onClick={handleConnectWallet}
                className={swapButtonClass}
              >
                <Zap className="h-5 w-5" />
                Connect wallet
              </button>
            ) : (
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
            )}
          </div>

          {/* Wallet Info */}
          {isWalletConnected && (
            <div className="mt-4 p-3 bg-black/30 rounded-lg">
              <div className="text-xs text-white/60">
                <div className="flex justify-between">
                  <span>Connected:</span>
                  <span>{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Chain:</span>
                  <span className="capitalize">{selectedChain}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SwapCard;
