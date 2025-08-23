@echo off
echo ========================================
echo GlueX DEX Aggregation Platform Setup
echo ========================================
echo.

echo Setting up Backend...
cd Backend
call setup.bat
cd ..

echo.
echo Setting up Frontend...
cd frontend
call setup.bat
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Start the backend server:
echo    cd Backend
echo    npm run dev
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser to the frontend URL (usually http://localhost:5173)
echo.
echo Note: Make sure to update the .env file in the Backend folder with your actual API keys!
echo.
echo For production, build the backend first:
echo cd Backend && npm run build && npm start
echo.
echo ========================================
echo New Features:
echo - Automatic TO token calculation when typing FROM amounts
echo - Real-time conversion rates from GlueX API
echo - Simplified Swap interface (no wallet connection required)
echo - Instant price updates when changing tokens/chains
echo ========================================
echo.
pause
