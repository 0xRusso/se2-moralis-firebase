import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import ProtectedRoute from "~~/components/ProtectedRoute";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { AuthContextProvider } from "~~/context/AuthContext";
import { useEthPrice } from "~~/hooks/scaffold-eth";
import { useAppStore } from "~~/services/store/store";
import { wagmiClient } from "~~/services/web3/wagmiClient";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const noAuthRequired = ["/", "/login", "/signup"];

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const price = useEthPrice();
  const setEthPrice = useAppStore(state => state.setEthPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (price > 0) {
      setEthPrice(price);
    }
  }, [setEthPrice, price]);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <AuthContextProvider>
      <WagmiConfig client={wagmiClient}>
        <NextNProgress />
        <RainbowKitProvider
          chains={appChains.chains}
          avatar={BlockieAvatar}
          theme={isDarkTheme ? darkTheme() : lightTheme()}
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">
              {noAuthRequired.includes(router.pathname) ? (
                <Component {...pageProps} />
              ) : (
                <ProtectedRoute>
                  <Component {...pageProps} />
                </ProtectedRoute>
              )}
            </main>
            <Footer />
          </div>
          <Toaster />
        </RainbowKitProvider>
      </WagmiConfig>
    </AuthContextProvider>
  );
};

export default ScaffoldEthApp;
