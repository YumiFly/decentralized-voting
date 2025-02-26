import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { usePublicClient ,http} from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors'; // 导入多种连接器
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia,mainnet],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/651f39896da44453ae9876482ed24fe3'),
    [mainnet.id]: http('https://mainnet.infura.io/v3/651f39896da44453ae9876482ed24fe3'),
  },
  connectors: [
    injected(), // MetaMask 等注入式钱包
    walletConnect({ projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID' }), // WalletConnect，需要申请 projectId
  ],
});

// 配置 Web3Modal
const projectId = '3f4b33e588bf46202ce3a4107b3c9df1'; // 替换为你的 Web3Modal Project ID
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light', // 匹配黑色背景
  themeVariables: {
    '--w3m-color-fg-1': '#fff',
    '--w3m-color-bg-1': '#1a1a1a',
    '--w3m-color-bg-2': '#2a2a2a',
    '--w3m-color-bg-3': '#333',
  } as any, // 使用类型断言跳过类型检查
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
);