import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon } from "@/icons/WalletIcon";

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="cursor-pointer justify-center w-full border border-primary text-primary text-sm flex gap-2 items-center bg-pink py-2 px-3 xl:px-6 xl:py-4 font-bold"
                  >
                    Connect Wallet
                    <WalletIcon />
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="text-primary border border-primary py-2 px-3 xl:px-6 xl:py-4"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex justify-center w-full gap-4 border border-primary text-primary items-center py-2 px-3 xl:px-6 xl:py-4 cursor-pointer"
                  >
                    <WalletIcon />
                    <p className="flex">{account.displayName}</p>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
