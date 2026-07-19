"use client";

import Image from "next/image";
import { SubmitEvent, useEffect, useState } from "react";
import image from "../../assets/offers.png";
import { PrimaryButton } from "../shared/PrimaryButton";
import { StarsIcon } from "@/icons/StarsIcon";
import { Field } from "../shared/Field";
import { Modal } from "../shared/Modal";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "../../abi/Marketplace.json";
import tokenAbi from "../../abi/NftToken.json";
import { SuccessModalContent } from "../shared/SuccessModalContent";
import { ErrorModalContent } from "../shared/ErrorModalContent";
import { useQueryClient } from "@tanstack/react-query";
import { updateMarketplace } from "@/app/actions";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config";

const MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ||
  "0xF2f314a96650dDBb29a5024363779e154fC74248";

export const UserListingForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    collectionAddress: "",
    tokenId: "",
    price: "",
  });

  const { data: isApproved } = useReadContract({
    abi: tokenAbi,
    address: formData.collectionAddress as `0x${string}`,
    functionName: "isApprovedForAll",
    args: address ? [address, MARKETPLACE_ADDRESS as `0x${string}`] : undefined,
    query: {
      enabled:
        /^0x[a-fA-F0-9]{40}$/.test(formData.collectionAddress) && !!address,
    },
  });

  const {
    writeContractAsync: writeApproveAsync,
    data: approveHash,
    isError: isApproveWriteError,
    reset: resetApprove,
    isPending: isApproveLoading,
  } = useWriteContract();

  const {
    writeContractAsync: writeListAsync,
    data: listHash,
    isError: isListWriteError,
    reset: resetList,
    isPending: isListPending,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isListConfirming, isSuccess: isListSuccess } =
    useWaitForTransactionReceipt({ hash: listHash });

  const isApprovePending = !!approveHash && !isApproveSuccess;
  const isLoading =
    isApproveConfirming ||
    isListConfirming ||
    isApprovePending ||
    isApproveLoading ||
    isListPending;

  const hasError = isApproveWriteError || isListWriteError;

  let currentModal: "form" | "success" | "error" | null = null;
  if (isListSuccess) currentModal = "success";
  else if (hasError) currentModal = "error";
  else if (isFormOpen) currentModal = "form";

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isListSuccess) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["listings", address] });
        updateMarketplace();
      }, 5000);
    }
  }, [isListSuccess, queryClient, address]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    resetApprove();
    resetList();

    try {
      if (!isApproved) {
        const tx = await writeApproveAsync({
          abi: tokenAbi,
          address: formData.collectionAddress as `0x${string}`,
          functionName: "setApprovalForAll",
          args: [MARKETPLACE_ADDRESS as `0x${string}`, true],
        });
        await waitForTransactionReceipt(config, {
          hash: tx,
        });
        await writeListAsync({
          abi: abi,
          address: MARKETPLACE_ADDRESS as `0x${string}`,
          functionName: "listNft",
          args: [
            formData.collectionAddress as `0x${string}`,
            BigInt(formData.tokenId),
            BigInt(formData.price),
          ],
        });

        setFormData({
          collectionAddress: "",
          tokenId: "",
          price: "",
        });
      } else {
        await writeListAsync({
          abi: abi,
          address: MARKETPLACE_ADDRESS as `0x${string}`,
          functionName: "listNft",
          args: [
            formData.collectionAddress as `0x${string}`,
            BigInt(formData.tokenId),
            BigInt(formData.price),
          ],
        });

        setFormData({
          collectionAddress: "",
          tokenId: "",
          price: "",
        });
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    if (isListSuccess || hasError) {
      resetApprove();
      resetList();
    }
  };

  if (currentModal)
    return (
      <Modal isOpen={true} onClose={handleCloseModal}>
        {currentModal === "form" && (
          <>
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-center text-center md:text-left mb-4">
              <Image src={image} alt="img" className="max-w-2/3 md:max-w-1/3" />

              <div className="flex flex-col gap-1.5 pt-1">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  List Your NFT
                </h2>
                <p className="text-sm text-muted leading-relaxed max-w-90">
                  Set the details below to list your NFT for sale on the
                  marketplace.
                </p>
              </div>
            </div>

            <hr className="border-white/5 mb-4" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Field
                label="Collection Address"
                value={formData.collectionAddress}
                disabled={isLoading}
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    collectionAddress: e.target.value,
                  }))
                }
                placeholder="0x..."
                id="CollectionAddress"
              />

              <Field
                label="Token ID"
                value={formData.tokenId}
                disabled={isLoading}
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    tokenId: e.target.value,
                  }))
                }
                placeholder="1"
                id="TokenID"
              />

              <div className="flex relative flex-col gap-2">
                <label htmlFor="price" className="text-muted">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  disabled={isLoading}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((formData) => ({
                      ...formData,
                      price: e.target.value,
                    }))
                  }
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
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.45)]"
              >
                <StarsIcon />
                {isLoading ? "Listing..." : "List NFT"}
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
          <h3 className="text-white text-xl font-bold">List your NFT</h3>
          <p className="text-muted text-sm">
            List your NFTs for sale and reach collectors around the world.
          </p>
        </div>
        <PrimaryButton onClick={() => setIsFormOpen(true)}>
          List NFT
        </PrimaryButton>
      </div>
      <Image src={image} alt="collection-image" className="object-contain" />
    </section>
  );
};
