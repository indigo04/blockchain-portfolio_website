"use client";

import { SubmitEvent, useEffect, useState } from "react";
import { PrimaryButton } from "../shared/PrimaryButton";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "../../abi/WilToken.json";
import { Modal } from "../shared/Modal";
import { updateHistory } from "@/app/actions";
import { SuccessModalContent } from "../shared/SuccessModalContent";
import { ErrorModalContent } from "../shared/ErrorModalContent";

const TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_ADDRESS ||
  "0x31D9052DfC3A6Ed999a64595B27863E2DDA1d79B";

export const FaucetForm = () => {
  const [tokens, setTokens] = useState("");
  const { isConnected, address } = useAccount();
  const [, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        updateHistory();
      }, 5000);
    }
  }, [isSuccess]);

  const isLoading = isPending || isConfirming;
  const hasError = isWriteError || isConfirmError;

  let currentModal: "success" | "error" | null = null;

  if (isSuccess) {
    currentModal = "success";
  } else if (hasError) {
    currentModal = "error";
  } else {
    currentModal = null;
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || isPending) return;

    reset();
    try {
      writeContract({
        abi: abi,
        address: TOKEN_ADDRESS as `0x${string}`,
        functionName: "mint",
        args: [address, tokens],
      });
      setTokens("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isSuccess || hasError) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 xl:shrink-0 xl:w-xs w-full bg-surface rounded-xl border flex flex-col gap-2 border-muted/25"
    >
      <h2 className="text-3xl text-text font-bold">Request Tokens</h2>
      <div className="flex relative flex-col gap-2">
        <label htmlFor="mint" className="text-muted">
          Amount
        </label>
        <input
          type="text"
          id="mint"
          value={tokens}
          onChange={(e) => setTokens(e.currentTarget.value)}
          className="pr-15 truncate w-full px-5 py-4 bg-surface border border-muted/25 rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
          placeholder="100"
          autoComplete="off"
        />
        <span className="absolute top-10.25 right-1 rounded-xl font-bold text-primary bg-primary/20 p-2">
          $WIL
        </span>
      </div>
      <PrimaryButton
        type="submit"
        disabled={!isConnected || tokens.length === 0 || isLoading}
      >
        {isLoading ? "Minting..." : "Mint Tokens"}
      </PrimaryButton>
      {!isConnected && (
        <p className="text-muted text-md">Connect your wallet</p>
      )}
      {currentModal && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          {currentModal === "success" && (
            <SuccessModalContent onClose={handleCloseModal} />
          )}

          {currentModal === "error" && (
            <ErrorModalContent onClose={handleCloseModal} />
          )}
        </Modal>
      )}
    </form>
  );
};
