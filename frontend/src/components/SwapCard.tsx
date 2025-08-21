import { useState } from "react"
import { ArrowDownUp, Settings, Zap } from "lucide-react"
import TokenSelector from "./TokenSelector"
import { DexButton } from "@/components/ui/dex-button"
import { Input } from "@/components/ui/input"

interface Token {
  symbol: string
  name: string
  icon: string
}

const SwapCard = () => {
  const [fromToken, setFromToken] = useState<Token | undefined>()
  const [toToken, setToToken] = useState<Token | undefined>()
  const [fromAmount, setFromAmount] = useState("")

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-dex-text-primary">Swap</h2>
          <DexButton variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </DexButton>
        </div>

        {/* From Token */}
        <div className="space-y-4">
          <div className="bg-dex-card rounded-xl p-4 border border-border">
            <TokenSelector
              label="From"
              selectedToken={fromToken}
              onTokenSelect={setFromToken}
            />
            <div className="mt-3">
              <Input
                type="number"
                placeholder="0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="text-2xl font-bold bg-transparent border-0 p-0 h-auto text-dex-text-primary placeholder:text-dex-text-muted focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <DexButton
              variant="ghost"
              size="icon"
              onClick={handleSwapTokens}
              className="h-10 w-10 rounded-full border border-border bg-dex-card hover:bg-dex-card-hover"
            >
              <ArrowDownUp className="h-4 w-4" />
            </DexButton>
          </div>

          {/* To Token */}
          <div className="bg-dex-card rounded-xl p-4 border border-border">
            <TokenSelector
              label="To"
              selectedToken={toToken}
              onTokenSelect={setToToken}
            />
            <div className="mt-3">
              <div className="text-2xl font-bold text-dex-text-muted">0</div>
            </div>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="mt-6">
          <DexButton variant="connect" className="w-full h-14 text-lg">
            <Zap className="h-5 w-5" />
            Connect wallet
          </DexButton>
        </div>
      
      </div>
    </div>
  )
}

export default SwapCard