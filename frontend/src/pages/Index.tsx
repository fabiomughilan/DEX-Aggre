import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SwapCard from "@/components/SwapCard"
import BackgroundEffects from "@/components/BackgroundEffects"
import AIBot from "@/components/AIBot"

const Index = () => {
  return (
    <div className="min-h-screen bg-dex-bg text-dex-text-primary">
      <BackgroundEffects />
      <Header />
      
      <main className="flex items-center justify-center min-h-screen pt-20 pb-20">
        <SwapCard />
      </main>
      
      <Footer />
      <AIBot />
    </div>
  );
};

export default Index;
