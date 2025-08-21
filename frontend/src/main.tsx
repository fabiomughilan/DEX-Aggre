import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import {PrivyProvider} from '@privy-io/react-auth';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cm2rvday400vh1l9d295ava21"
      clientId="client-WY5ckKFb5e4FYfic4QVm7P3R8pXcfNmoMwsE7s7gcR13X"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);