import 'src/styles/globals.css';
import 'diditsdktest/styles.css';
import type { AppProps } from 'next/app';

import { DiditAuthMethod, DiditAuthProvider, DiditRainbowkitProvider, getDefaultWallets, lightTheme } from 'diditsdktest';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'App with Didit',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function App({ Component, pageProps }: AppProps) {
  return (
        <WagmiConfig
          config={wagmiConfig} // The one that was configured before for Wagmi
    >
      <DiditAuthProvider
        authMethods={[DiditAuthMethod.WALLET, DiditAuthMethod.GOOGLE]}
        baseUrl="http://localhost:3000/api"
        clientId={process.env.NEXT_PUBLIC_DIDIT_CLIENT_ID || ''}
        claims={ process.env.NEXT_PUBLIC_DIDIT_CLAIMS}
        scope={process.env.NEXT_PUBLIC_DIDIT_SCOPE}
        onLogin={(_authMethod?: DiditAuthMethod) =>
          console.log('Logged in Didit with', _authMethod)
        }
        onLogout={() => console.log('Logged out Didit')}
        onError={(_error: string) => console.error('Didit error: ', _error)}
      >
        <DiditRainbowkitProvider
          chains={chains}
          theme={lightTheme()}
        >
          <Component {...pageProps} />
        </DiditRainbowkitProvider>
      </DiditAuthProvider>
    </WagmiConfig>
    );
}
