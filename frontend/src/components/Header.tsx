import { DexButton } from "@/components/ui/dex-button"
import { Wallet } from "lucide-react"
import ConnectWallet from "./ConnectWallet"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dex-bg/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-dex-text-primary">
              Thalaivar <span className="text-dex-green">X</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-dex-text-secondary hover:text-dex-text-primary transition-colors">
              Flash Loans
            </a>
            <a href="#" className="text-dex-text-secondary hover:text-dex-text-primary transition-colors">
              Flash Loans
            </a>
            <a href="#" className="text-dex-text-secondary hover:text-dex-text-primary transition-colors">
              Flash Loans
            </a>
          </nav>

          {/* Connect Wallet Button */}
          <div className="gap-2">
            <ConnectWallet/>
          </div> 
        </div>
      </div>
    </header>
  )
}

export default Header