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

interface TokenPriceRequest {
  domestic_blockchain: string;
  domestic_token: string;
  foreign_blockchain: string;
  foreign_token: string;
}

interface TokenPriceResponse {
  domestic_blockchain: string;
  domestic_token: string;
  foreign_blockchain: string;
  foreign_token: string;
  price: number;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useSwap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  const getConversionRate = async (
    inputToken: Token,
    outputToken: Token,
    inputChainId: string,
    outputChainId: string
  ): Promise<number | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            domestic_blockchain: inputChainId,
            domestic_token: inputToken.address,
            foreign_blockchain: outputChainId,
            foreign_token: outputToken.address,
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        console.warn('No conversion rate data available');
        return null;
      }

      const rate = data.data[0].price;
      setConversionRate(rate);
      return rate;
    } catch (err) {
      console.error('Failed to fetch conversion rate:', err);
      // Don't set error state for price fetching failures as they're not critical
      return null;
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
  const clearConversionRate = () => setConversionRate(null);

  return {
    isLoading,
    error,
    conversionRate,
    getConversionRate,
    getSupportedChains,
    getSupportedTokens,
    clearError,
    clearConversionRate,
  };
};
