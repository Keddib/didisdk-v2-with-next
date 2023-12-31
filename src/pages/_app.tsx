import 'src/styles/globals.css';
import 'diditsdktest/styles.css';
import {
  DiditAuthMethod,
  DiditAuthProvider,
  DiditRainbowkitProvider,
  getDefaultWallets,
  lightTheme,
} from 'diditsdktest';
import type { AppProps } from 'next/app';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME || '',
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig
      config={wagmiConfig} // The one that was configured before for Wagmi
    >
      <DiditAuthProvider
        authMethods={[DiditAuthMethod.WALLET, DiditAuthMethod.GOOGLE]}
        claims={process.env.NEXT_PUBLIC_DIDIT_CLAIMS}
        clientId={process.env.NEXT_PUBLIC_DIDIT_CLIENT_ID || ''}
        emailAuthBaseUrl={
          process.env.NEXT_PUBLIC_DIDIT_EMAIL_AUTH_BASE_URL || ''
        }
        onError={(_error: string) => console.error('Didit error: ', _error)}
        onLogin={(_authMethod?: DiditAuthMethod) =>
          console.error('Logged in Didit with', _authMethod)
        }
        onLogout={() => console.error('Logged out Didit')}
        scope={process.env.NEXT_PUBLIC_DIDIT_SCOPE}
        walletAuthBaseUrl='/api'
        walletAuthorizationPath="/wallet-authorization"
        tokenAuthorizationPath="/token"
      >
        <DiditRainbowkitProvider chains={chains} theme={lightTheme()}>
          <Component {...pageProps} />
        </DiditRainbowkitProvider>
      </DiditAuthProvider>
    </WagmiConfig>
  );
}
