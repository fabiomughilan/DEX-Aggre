@echo off
echo Installing dependencies...
npm install

echo.
echo Building TypeScript...
npm run build

echo.
echo Creating .env file...
if not exist .env (
    echo # GlueX API Configuration > .env
    echo GLUEX_API_KEY=your_gluex_api_key_here >> .env
    echo. >> .env
    echo # RPC URLs for different chains >> .env
    echo ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_alchemy_key >> .env
    echo SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key >> .env
    echo ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/your_alchemy_key >> .env
    echo BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/your_alchemy_key >> .env
    echo POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your_alchemy_key >> .env
    echo OPTIMISM_RPC_URL=https://opt-mainnet.g.alchemy.com/v2/your_alchemy_key >> .env
    echo. >> .env
    echo # Server Configuration >> .env
    echo PORT=3001 >> .env
    echo .env file created! Please update it with your actual API keys.
) else (
    echo .env file already exists.
)

echo.
echo To start the server in development mode (with auto-reload):
echo npm run dev
echo.
echo Or for production (after building):
echo npm start
echo.
pause
