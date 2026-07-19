"use client";

import { config } from "@/config";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Sidebar } from "./Sidebar";
import "@rainbow-me/rainbowkit/styles.css";
import { Header } from "./Header";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BackgroundGlow } from "./BackgroundGlow";

const queryClient = new QueryClient();

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1200px)");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} locale="en-US">
          <main className="flex flex-col relative min-h-screen xl:flex-row xl:gap-8">
            <BackgroundGlow />
            <Header
              handleSidebarOpen={() => {
                if (isMobile) {
                  setIsOpen(true);
                }
              }}
            />
            <Sidebar
              isOpen={isMobile ? isOpen : false}
              onClose={() => setIsOpen(false)}
            />
            <div className="w-full flex flex-col gap-4 p-4 xl:p-6">
              {children}
            </div>
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
