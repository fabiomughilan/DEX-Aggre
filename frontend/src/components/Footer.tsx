import { Github, MessageCircle, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-dex-bg/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-dex-text-muted hover:text-dex-text-primary transition-colors text-sm">
              Home
            </a>
            <a href="#" className="text-dex-text-muted hover:text-dex-text-primary transition-colors text-sm">
              Docs
            </a>
            <a href="#" className="text-dex-text-muted hover:text-dex-text-primary transition-colors text-sm">
              Support
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-dex-text-muted hover:text-dex-green transition-colors">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="#" className="text-dex-text-muted hover:text-dex-green transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="text-dex-text-muted hover:text-dex-green transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer