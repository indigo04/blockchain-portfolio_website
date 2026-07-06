import { FaucetFeatures } from "@/components/faucet/FaucetFeatures";
import { FaucetForm } from "@/components/faucet/FaucetForm";
import { FaucetHistory } from "@/components/faucet/FaucetHistory";
import { FaucetPromo } from "@/components/faucet/FaucetPromo";

export default function Faucet() {
  return (
    <>
      <FaucetPromo />
      <FaucetFeatures />
      <div className="flex flex-col xl:flex-row w-full gap-4">
        <FaucetForm />
        <FaucetHistory />
      </div>
    </>
  );
}
