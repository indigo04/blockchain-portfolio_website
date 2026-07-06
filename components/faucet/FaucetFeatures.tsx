import { LimitIcon } from "@/icons/LimitIcon";
import { NetworkIcon } from "@/icons/NetworkIcon";
import { TokenIcon } from "@/icons/TokenIcon";

export const FaucetFeatures = () => {
  const features = [
    {
      title: "Token",
      value: "$WIL",
      description: "The native ERC-20 token of WhatIsLove ecosystem",
      icon: TokenIcon,
    },
    {
      title: "Network",
      value: "Sepolia",
      description: "This faucet is running on Sepolia testnet",
      icon: NetworkIcon,
    },
    {
      title: "Limit",
      value: "No Limits",
      description: "Mint as many tokens as you need. No cooling period",
      icon: LimitIcon,
    },
  ];
  return (
    <div className="flex flex-col justify-between gap-2 xl:flex-row w-full items-center">
      {features.map((feature) => (
        <div
          className="flex gap-4 w-full bg-surface p-4 rounded-xl border border-muted/25"
          key={feature.title}
        >
          <span className="p-4 w-fit h-fit rounded-xl border-muted/25 text-primary bg-primary/20">
            {feature.icon()}
          </span>
          <div className="flex flex-col">
            <h3 className="text-primary">{feature.title}</h3>
            <p className="text-text font-bold text-xl">{feature.value}</p>
            <p className="text-muted">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
