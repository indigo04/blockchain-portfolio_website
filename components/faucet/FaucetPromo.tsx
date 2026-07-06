import { ChainIcon } from "@/icons/ChainIcon";

export const FaucetPromo = () => {
  return (
    <section className="flex flex-col w-full xl:flex-row gap-3">
      <div className="flex flex-col xl:w-1/2 w-full gap-2">
        <h3 className="text-xl font-bold text-primary">Faucet</h3>
        <h1 className="xl:text-6xl text-3xl font-bold text-text">
          Mint $WIL Tokens For Your
          <strong className="text-primary"> Journey</strong>
        </h1>
        <p className="text-muted">
          Get free $WIL tokens on Sepolia testnet. <br /> Use them to explore,
          create and trade on our platform.
        </p>
        <div className="border flex items-center justify-between gap-3 max-w-xs py-4 px-6 rounded-full border-muted/25">
          <div className="text-primary flex items-center gap-2">
            <ChainIcon /> <p className="text-text">Network: Sepolia</p>
          </div>
          <div className="text-primary flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <p className="text-text">Connected</p>
          </div>
        </div>
      </div>
    </section>
  );
};
