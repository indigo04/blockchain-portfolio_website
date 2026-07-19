import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_REOWN_APP_NAME || "",
  appDescription: process.env.NEXT_PUBLIC_REOWN_APP_DESCRIPTION || "",
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});
