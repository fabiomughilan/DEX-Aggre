const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-bg" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {/* Top left particle */}
        <div className="absolute top-32 left-32 w-1 h-1 bg-dex-green rounded-full animate-pulse" />
        <div className="absolute top-40 left-20 w-0.5 h-0.5 bg-dex-green/60 rounded-full animate-pulse delay-1000" />
        
        {/* Top right particle */}
        <div className="absolute top-48 right-40 w-1 h-1 bg-dex-green rounded-full animate-pulse delay-500" />
        <div className="absolute top-32 right-60 w-0.5 h-0.5 bg-dex-green/60 rounded-full animate-pulse delay-1500" />
        
        {/* Bottom left particles */}
        <div className="absolute bottom-64 left-48 w-1 h-1 bg-dex-green rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-80 left-32 w-0.5 h-0.5 bg-dex-green/60 rounded-full animate-pulse delay-300" />
        
        {/* Bottom right particles */}
        <div className="absolute bottom-48 right-32 w-1 h-1 bg-dex-green rounded-full animate-pulse delay-1200" />
        <div className="absolute bottom-72 right-56 w-0.5 h-0.5 bg-dex-green/60 rounded-full animate-pulse delay-800" />
        
        {/* Center area particles */}
        <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-dex-green/40 rounded-full animate-pulse delay-2000" />
        <div className="absolute top-2/3 right-1/4 w-0.5 h-0.5 bg-dex-green/40 rounded-full animate-pulse delay-1800" />
      </div>
      
      {/* Subtle radial gradients for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dex-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dex-green/5 rounded-full blur-3xl" />
    </div>
  )
}

export default BackgroundEffects