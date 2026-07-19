"use client";

import Image from "next/image";
import { SubmitEvent, useEffect, useState } from "react";
import image from "../../assets/collection.png";
import { PrimaryButton } from "../shared/PrimaryButton";
import { Field } from "../shared/Field";
import { StarsIcon } from "@/icons/StarsIcon";
import { Modal } from "../shared/Modal";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "../../abi/NftFactory.json";
import { SuccessModalContent } from "../shared/SuccessModalContent";
import { ErrorModalContent } from "../shared/ErrorModalContent";
import { useQueryClient } from "@tanstack/react-query";

const FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_FACTORY_ADDRESS ||
  "0x594A089a67Fce318977b23cD7e89340fA588133C";

export const UserCollectionForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const { address } = useAccount();

  const {
    writeContract,
    isError: isWriteError,
    data: hash,
    reset,
    isPending,
  } = useWriteContract();
  const {
    isSuccess,
    isLoading: isConfirming,
    isError: isConfirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const isLoading = isPending || isConfirming;
  const hasError = isWriteError || isConfirmError;

  let currentModal: "form" | "success" | "error" | null = null;

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["collections", address] });
      }, 5000);
    }
  }, [isSuccess, queryClient, address]);

  if (isSuccess) {
    currentModal = "success";
  } else if (hasError) {
    currentModal = "error";
  } else if (isFormOpen) {
    currentModal = "form";
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || isPending) return;

    reset();
    try {
      writeContract({
        abi: abi,
        address: FACTORY_ADDRESS as `0x${string}`,
        functionName: "createCollection",
        args: [name, symbol],
      });

      setName("");
      setSymbol("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    if (isSuccess || hasError) {
      reset();
    }
  };

  if (currentModal)
    return (
      <Modal isOpen={true} onClose={handleCloseModal}>
        {currentModal === "form" && (
          <>
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-center text-center md:text-left mb-4">
              <Image src={image} alt="img" className="max-w-1/2 md:max-w-1/3" />
              <div className="flex flex-col gap-1.5 pt-1">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Create New Collection
                </h2>
                <p className="text-sm text-muted leading-relaxed max-w-90">
                  Build your brand and start your NFT journey. <br /> Fill in
                  the details below to create your collection.
                </p>
              </div>
            </div>

            <hr className="border-white/5 mb-4" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Field
                label="Collection Name"
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                id="CollectionName"
              />

              <Field
                label="Collection Symbol"
                disabled={isLoading}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter collection symbol (e.g. LOVE)"
                maxLength={10}
                minLength={2}
                id="CollectionSymbol"
                description="2-10 characters. Letters and numbers only."
              />

              <PrimaryButton
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.45)]"
              >
                <StarsIcon />
                {isLoading ? "Creating..." : "Create Collection"}
              </PrimaryButton>
            </form>
          </>
        )}

        {currentModal === "success" && (
          <SuccessModalContent onClose={handleCloseModal} />
        )}

        {currentModal === "error" && (
          <ErrorModalContent onClose={handleCloseModal} />
        )}
      </Modal>
    );

  return (
    <section className="p-4 rounded-xl bg-surface border border-muted/25 flex flex-col-reverse items-center">
      <div className="flex w-full flex-col gap-4">
        <div className="flex text-center flex-col gap-2">
          <h3 className="text-white text-xl font-bold">
            Create a New Collection
          </h3>
          <p className="text-muted text-sm">
            Build your brand and start your NFT journey.
          </p>
        </div>
        <PrimaryButton onClick={() => setIsFormOpen(true)}>
          Create Collection
        </PrimaryButton>
      </div>
      <Image src={image} alt="collection-image" className="object-contain" />
    </section>
  );
};
