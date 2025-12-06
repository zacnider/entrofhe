import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

const WALLETCONNECT_PROJECT_ID = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID;
const SEPOLIA_RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;

if (!WALLETCONNECT_PROJECT_ID) {
  console.warn('REACT_APP_WALLETCONNECT_PROJECT_ID is not set. WalletConnect features may not work.');
}

// WalletConnect project ID is required for RainbowKit
// Get one from https://cloud.walletconnect.com/
const config = getDefaultConfig({
  appName: 'Entrofhe',
  projectId: WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000', // Placeholder - replace with real ID
  chains: SEPOLIA_RPC_URL
    ? [
        {
          ...sepolia,
          rpcUrls: {
            default: {
              http: [SEPOLIA_RPC_URL],
            },
          },
        },
      ]
    : [sepolia],
  ssr: false,
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);

