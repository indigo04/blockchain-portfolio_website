import { StarsIcon } from "@/icons/StarsIcon";
import { PrimaryButton } from "./PrimaryButton";
import image from "../../assets/error.png";
import Image from "next/image";

type Props = {
  onClose: () => void;
};

export const ErrorModalContent = ({ onClose }: Props) => {
  return (
    <div className="text-center flex flex-col w-fit items-center gap-4 text-white">
      <Image
        src={image}
        alt="success"
        width={0}
        height={0}
        className="w-full h-full max-w-xs"
      />
      <div>
        <h2 className="text-2xl font-bold mb-2">Transaction Failed!</h2>
        <p className="text-muted">
          Your transaction could not be completed. <br /> No changes were made.
        </p>
      </div>
      <PrimaryButton
        type="button"
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-xl transition-all"
      >
        <StarsIcon />
        Continue
      </PrimaryButton>
    </div>
  );
};
