import { StarsIcon } from "@/icons/StarsIcon";
import { PrimaryButton } from "./PrimaryButton";
import image from "../../assets/success.png";
import Image from "next/image";

type Props = {
  onClose: () => void;
};

export const SuccessModalContent = ({ onClose }: Props) => {
  return (
    <div className="text-center flex flex-col items-center gap-4 text-white">
      <Image
        src={image}
        alt="success"
        width={0}
        height={0}
        className="w-full h-full max-w-xs"
      />
      <div>
        <h2 className="text-2xl font-bold mb-2">Transaction Successful!</h2>
        <p className="text-muted">
          Your transaction has been confirmed on the blockchain. <br /> It may
          take a few moments for your data to update
        </p>
      </div>
      <PrimaryButton
        type="button"
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.45)]"
      >
        <StarsIcon />
        Continue
      </PrimaryButton>
    </div>
  );
};
