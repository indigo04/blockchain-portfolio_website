"use client";

import { ListingWithImage } from "@/types/Listing";
import { SliceAddress } from "@/utils/SliceAddress";
import Image from "next/image";
import { CopyAddress } from "../shared/CopyAddress";
import { PrimaryButton } from "../shared/PrimaryButton";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useEffect, useState } from "react";
import { updateMarketplace } from "@/app/actions";
import abi from "../../abi/Marketplace.json";
import { SuccessModalContent } from "../shared/SuccessModalContent";
import { ErrorModalContent } from "../shared/ErrorModalContent";
import { Modal } from "../shared/Modal";
import tokenAbi from "../../abi/NftToken.json";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config";

type Props = {
  listing: ListingWithImage;
};

const MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ||
  "0xF2f314a96650dDBb29a5024363779e154fC74248";

const PAYMENT_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS ||
  "0x31D9052DfC3A6Ed999a64595B27863E2DDA1d79B";

export const MarketplaceItem = ({ listing }: Props) => {
  const { isConnected, address } = useAccount();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: tokenAbi,
    address: PAYMENT_TOKEN_ADDRESS as `0x${string}`,
    functionName: "allowance",
    args: address ? [address, MARKETPLACE_ADDRESS as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!PAYMENT_TOKEN_ADDRESS,
    },
  });

  const priceBigInt = BigInt(listing.price);
  const isApproved =
    allowance !== undefined &&
    allowance &&
    BigInt(String(allowance)) >= priceBigInt;

  const {
    writeContractAsync: writeApproveAsync,
    data: approveHash,
    isError: isApproveWriteError,
    reset: resetApprove,
    isPending: isApproveLoading,
  } = useWriteContract();

  const {
    writeContractAsync: writeBuyAsync,
    data: buyHash,
    isError: isBuyWriteError,
    reset: resetBuy,
    isPending: isBuyPending,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({ hash: buyHash });

  const isApprovePending = !!approveHash && !isApproveSuccess;
  const isLoading =
    isApproveConfirming ||
    isBuyConfirming ||
    isApprovePending ||
    isApproveLoading ||
    isBuyPending;

  const hasError = isApproveWriteError || isBuyWriteError;

  let currentModal: "success" | "error" | "form" | null = null;

  if (isBuySuccess) {
    currentModal = "success";
  } else if (hasError) {
    currentModal = "error";
  } else if (isFormOpen) {
    currentModal = "form";
  }

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isBuySuccess) {
      setTimeout(() => {
        updateMarketplace();
      }, 5000);
    }
  }, [isBuySuccess]);

  const handleSubmit = async () => {
    if (isLoading) return;

    resetApprove();
    resetBuy();

    try {
      if (!isApproved) {
        const tx = await writeApproveAsync({
          abi: tokenAbi,
          address: PAYMENT_TOKEN_ADDRESS as `0x${string}`,
          functionName: "approve",
          args: [MARKETPLACE_ADDRESS as `0x${string}`, priceBigInt],
        });
        await waitForTransactionReceipt(config, {
          hash: tx,
        });
        await writeBuyAsync({
          abi: abi,
          address: MARKETPLACE_ADDRESS as `0x${string}`,
          functionName: "buyNft",
          args: [listing.collectionId, BigInt(listing.tokenId)],
        });
      } else {
        await writeBuyAsync({
          abi: abi,
          address: MARKETPLACE_ADDRESS as `0x${string}`,
          functionName: "buyNft",
          args: [listing.collectionId, BigInt(listing.tokenId)],
        });
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    if (isBuySuccess || hasError) {
      resetApprove();
      resetBuy();
    }
  };

  return (
    <div className="flex flex-col border border-muted/25 rounded-xl">
      {currentModal && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          {currentModal === "form" && (
            <>
              <div className="flex flex-col items-center gap-5 text-center mb-4">
                {listing.imageUrl && (
                  <Image
                    src={listing.imageUrl}
                    alt="img"
                    width={300}
                    height={300}
                    className="w-full h-full max-w-xs max-h-75"
                  />
                )}
                <div className="flex flex-col gap-1.5 pt-1">
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    Purchase <strong className="text-primary">NFT</strong>
                  </h2>
                  <p className="text-sm text-muted leading-relaxed max-w-90">
                    You are about to purchase this NFT. <br />
                    Make sure you want to do it before confirming.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PrimaryButton
                  className="bg-red-800 hover:bg-red-900 w-full"
                  disabled={isLoading}
                  onClick={handleCloseModal}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="w-full"
                >
                  {isLoading ? "Purchasing..." : "Purchase"}
                </PrimaryButton>
              </div>
            </>
          )}

          {currentModal === "success" && (
            <SuccessModalContent onClose={handleCloseModal} />
          )}

          {currentModal === "error" && (
            <ErrorModalContent onClose={handleCloseModal} />
          )}
        </Modal>
      )}
      {listing.imageUrl && (
        <Image
          src={listing.imageUrl}
          alt="NFT-image"
          width={300}
          height={300}
          className="object-cover aspect-square w-full h-fit rounded-xl"
        />
      )}
      <div className="flex flex-col p-2">
        <h3 className="text-white font-bold text-xl">
          {listing.collection.name} #{listing.tokenId}
        </h3>
        <p className="text-muted font-bold text-xl">
          {listing.collection.symbol}
        </p>
        <div className="flex gap-2 text-white items-center">
          {SliceAddress(listing.collectionId)}
          <CopyAddress address={listing.collectionId} />
        </div>
        <p className="text-xl text-primary font-bold">{listing.price} $WIL</p>
      </div>
      <PrimaryButton
        disabled={
          !isConnected ||
          address?.toLowerCase() === listing.seller.toLowerCase()
        }
        onClick={() => setIsFormOpen(true)}
      >
        Buy now
      </PrimaryButton>
    </div>
  );
};
