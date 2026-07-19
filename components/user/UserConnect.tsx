import { ConnectWalletButton } from "../shared/ConnectWalletButton";
import image from "../../assets/wallet.png";
import Image from "next/image";

export const UserConnect = () => {
  return (
    <div className="p-4 mt-25 md:mt-0 xl:p-8 border border-primary mx-auto my-auto w-9/10 h-full flex flex-col justify-center items-center rounded-xl shadow-md shadow-primary">
      <Image
        src={image}
        alt="wallet-img"
        loading="eager"
        className="object-contain xl:w-2/3"
      />
      <div className="flex flex-col max-w-sm gap-4 text-center">
        <h2 className="text-xl xl:text-2xl text-white font-bold">
          Connect Your Wallet
        </h2>
        <p className="text-muted font-bold">
          You need to connect your wallet to view your profile, transactions and
          manage your tokens.
        </p>
        <ConnectWalletButton />
      </div>
    </div>
  );
};
