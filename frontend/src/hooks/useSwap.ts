import { useState } from 'react';

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

interface QuoteResponse {
  success: boolean;
  data: {
    router: string;
    calldata: string;
    inputAmount: string;
    outputAmount: string;
  };
  error?: string;
}

interface SwapResponse {
  success: boolean;
  data: {
    transactionHash: string;
    status: boolean;
    gasUsed: string;
    blockNumber: string;
  };
  error?: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useSwap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteResponse['data'] | null>(null);

  const getQuote = async (
    inputToken: Token,
    outputToken: Token,
    inputAmount: string,
    userAddress: string,
    chainId: string
  ): Promise<QuoteResponse['data'] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert amount to wei based on token decimals
      const inputAmountWei = (parseFloat(inputAmount) * Math.pow(10, inputToken.decimals)).toString();

      const response = await fetch(`${API_BASE_URL}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputToken: inputToken.address,
          outputToken: outputToken.address,
          inputAmount: inputAmountWei,
          userAddress,
          chainID: chainId,
        }),
      });

      const data: QuoteResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get quote');
      }

      setQuote(data.data);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async (
    calldata: string,
    routerAddress: string,
    value: string,
    chainId: number,
    userAddress: string,
    privateKey: string
  ): Promise<SwapResponse['data'] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calldata,
          routerAddress,
          value,
          chainId,
          userAddress,
          privateKey,
        }),
      });

      const data: SwapResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to execute swap');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute swap';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSupportedChains = async (): Promise<Chain[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chains`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch chains');
      }

      return data.data;
    } catch (err) {
      console.error('Failed to fetch chains:', err);
      return [];
    }
  };

  const getSupportedTokens = async (chainId: string): Promise<Token[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tokens/${chainId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch tokens');
      }

      return data.data;
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
      return [];
    }
  };

  const clearError = () => setError(null);
  const clearQuote = () => setQuote(null);

  return {
    isLoading,
    error,
    quote,
    getQuote,
    executeSwap,
    getSupportedChains,
    getSupportedTokens,
    clearError,
    clearQuote,
  };
};
