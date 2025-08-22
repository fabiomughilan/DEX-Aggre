import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DexButton } from "@/components/ui/dex-button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  icon?: string
  usdPrice?: number
}

interface TokenSelectorProps {
  label?: string
  selectedToken?: Token
  onTokenSelect: (token: Token) => void
  availableTokens?: Token[]
  hideLabel?: boolean
}

const TokenSelector = ({ 
  label, 
  selectedToken, 
  onTokenSelect, 
  availableTokens = [],
  hideLabel = false 
}: TokenSelectorProps) => {
  const [open, setOpen] = useState(false)

  // Use availableTokens if provided, otherwise fall back to default tokens
  const tokens = availableTokens.length > 0 ? availableTokens : [
    { symbol: "ETH", name: "Ethereum", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18, icon: "⟠" },
    { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, icon: "💎" },
    { symbol: "USDT", name: "Tether", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, icon: "💰" },
  ]

  return (
    <div className="space-y-2">
      {!hideLabel && label && (
        <label className="text-sm text-dex-text-muted font-medium">{label}</label>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DexButton 
            variant="secondary" 
            className="w-full justify-between h-12 bg-dex-card hover:bg-dex-card-hover border border-border"
          >
            {selectedToken ? (
              <div className="flex items-center gap-3">
                <span className="text-lg">{selectedToken.icon || "🪙"}</span>
                <div className="text-left">
                  <div className="font-medium text-dex-text-primary">{selectedToken.symbol}</div>
                  <div className="text-xs text-dex-text-muted">{selectedToken.name}</div>
                </div>
              </div>
            ) : (
              <span className="text-dex-text-muted">Select token</span>
            )}
            <ChevronDown className="h-4 w-4 text-dex-text-muted" />
          </DexButton>
        </DialogTrigger>
        <DialogContent className="bg-dex-card border-border">
          <DialogHeader>
            <DialogTitle className="text-dex-text-primary">Select a token</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onTokenSelect(token)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-transparent hover:bg-dex-card-hover transition-colors"
              >
                <span className="text-lg">{token.icon || "🪙"}</span>
                <div className="text-left flex-1">
                  <div className="font-medium text-dex-text-primary">{token.symbol}</div>
                  <div className="text-sm text-dex-text-muted">{token.name}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TokenSelector