// Simple test script for the price endpoint
const testPriceEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          domestic_blockchain: "ethereum",
          domestic_token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
          foreign_blockchain: "ethereum",
          foreign_token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        }]
      }),
    });

    const data = await response.json();
    console.log('Price API Response:', data);
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('✅ Price endpoint working!');
      console.log(`1 ETH = ${data.data[0].price} USDC`);
    } else {
      console.log('❌ Price endpoint returned no data');
    }
  } catch (error) {
    console.error('❌ Error testing price endpoint:', error.message);
  }
};

// Test the endpoint
testPriceEndpoint();
