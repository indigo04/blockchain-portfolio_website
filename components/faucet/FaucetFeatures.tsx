import { LimitIcon } from "@/icons/LimitIcon";
import { NetworkIcon } from "@/icons/NetworkIcon";
import { TokenIcon } from "@/icons/TokenIcon";
import { FaucetFeatureCard } from "./FaucetFeatureCard";

export const FaucetFeatures = () => {
  const features = [
    {
      title: "Token",
      value: "$WIL",
      description: "The native ERC-20 token of WhatIsLove ecosystem",
      icon: <TokenIcon />,
    },
    {
      title: "Network",
      value: "Sepolia",
      description: "This faucet is running on Sepolia testnet",
      icon: <NetworkIcon />,
    },
    {
      title: "Limit",
      value: "No Limits",
      description: "Mint as many tokens as you need. No cooling period",
      icon: <LimitIcon />,
    },
  ];
  return (
    <div className="flex flex-col justify-between gap-2 xl:flex-row w-full items-center">
      {features.map((feature) => {
        return <FaucetFeatureCard card={feature} key={feature.title} />;
      })}
    </div>
  );
};
