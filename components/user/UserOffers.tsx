"use client";

import { Listing, ListingWithImage } from "@/types/Listing";
import { fetchUserListings } from "@/utils/FetchUserListings";
import { fetchNftImage } from "@/utils/Metadata";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "../../abi/Marketplace.json";
import { Modal } from "../shared/Modal";
import { SuccessModalContent } from "../shared/SuccessModalContent";
import { ErrorModalContent } from "../shared/ErrorModalContent";
import image from "../../assets/cancel.png";
import { PrimaryButton } from "../shared/PrimaryButton";

const MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ||
  "0xF2f314a96650dDBb29a5024363779e154fC74248";

export const UserOffers = () => {
  const { address } = useAccount();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedListing, setSelectedListing] =
    useState<ListingWithImage | null>(null);

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
  } = useWaitForTransactionReceipt({ hash });

  const isLoading = isPending || isConfirming;
  const hasError = isWriteError || isConfirmError;

  let currentModal: "success" | "error" | "form" | null = null;
  if (isSuccess) currentModal = "success";
  else if (hasError) currentModal = "error";
  else if (isFormOpen) currentModal = "form";

  const queryClient = useQueryClient();

  const {
    data: listings,
    isPending: isListingsLoading,
    isError: isListingsError,
  } = useQuery<ListingWithImage[]>({
    queryKey: ["listings", address],
    queryFn: async () => {
      const baseListings = await fetchUserListings(address);

      return await Promise.all(
        baseListings.map(async (listing: Listing) => {
          try {
            const imageUrl = await fetchNftImage(
              listing.collectionId,
              listing.tokenId.toString(),
            );
            return { ...listing, imageUrl };
          } catch {
            return { ...listing, imageUrl: null };
          }
        }),
      );
    },
    enabled: !!address,
    throwOnError: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["listings", address] });
      }, 5000);
    }
  }, [isSuccess, queryClient, address]);

  const handleSubmit = async (collectionAddress: string, tokenId: string) => {
    if (isLoading) return;
    reset();
    try {
      writeContract({
        abi: abi,
        address: MARKETPLACE_ADDRESS as `0x${string}`,
        functionName: "cancelListing",
        args: [collectionAddress, BigInt(tokenId)],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setSelectedListing(null);
    if (isSuccess || hasError) {
      reset();
    }
  };

  const handleOpenCancelModal = (el: ListingWithImage) => {
    setSelectedListing(el);
    setIsFormOpen(true);
  };

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-white font-bold text-xl xl:text-3xl">
        Your Listings
      </h3>

      {isListingsLoading && (
        <p className="text-muted font-bold text-xl">Loading...</p>
      )}
      {isListingsError && <p className="text-muted font-bold text-xl">Error</p>}
      {listings && listings.length === 0 && (
        <p className="text-muted font-bold text-xl">
          Your Listing list is empty
        </p>
      )}

      {listings && listings.length > 0 && (
        <div className="overflow-x-auto w-full bg-surface py-1 border border-muted/25 rounded-xl">
          <table className="min-w-2xl md:w-full text-center table-fixed">
            <thead className="text-muted text-nowrap">
              <tr>
                <th className="p-2 w-[40%]">NFT</th>
                <th className="p-2 w-[20%]">Price</th>
                <th className="p-2 w-[20%]">Status</th>
                <th className="p-2 w-[20%] px-4"></th>
              </tr>
            </thead>
            <tbody className="text-white text-nowrap font-bold">
              {listings.map((el) => (
                <tr key={el.id}>
                  <td className="p-1">
                    <div className="flex relative items-center justify-center gap-2">
                      {el.imageUrl && (
                        <Image
                          src={el.imageUrl}
                          width={80}
                          height={80}
                          alt="nft-image"
                          className="object-cover aspect-square"
                        />
                      )}
                      <div className="flex flex-col items-start">
                        <p>
                          {el.collection.name} #{el.tokenId}
                        </p>
                        <p className="text-muted">{el.collection.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-1">{el.price} $WIL</td>
                  <td className="p-1">
                    <div
                      className={
                        "py-2 border w-30 mx-auto rounded-xl " +
                        (el.status === "Active"
                          ? "border-green-800 bg-green-600/80"
                          : el.status === "Sold"
                            ? "border-yellow-800 bg-yellow-600/80"
                            : "border-gray-800 bg-gray-600/80")
                      }
                    >
                      {el.status}
                    </div>
                  </td>
                  <td className="p-1">
                    {el.status === "Active" && (
                      <button
                        type="button"
                        onClick={() => handleOpenCancelModal(el)}
                        className="p-2 cursor-pointer border-red-800 border rounded-xl bg-red-600/40"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentModal && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          {currentModal === "form" && selectedListing && (
            <>
              <div className="flex flex-col items-center gap-5 text-center mb-4">
                <Image
                  src={image}
                  alt="img"
                  className="w-full h-full max-w-xs"
                />
                <div className="flex flex-col gap-1.5 pt-1">
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    Cancel Listing?
                  </h2>
                  <p className="text-sm text-muted leading-relaxed max-w-90">
                    Are your sure you want to cancel the listing of{" "}
                    <strong>
                      {selectedListing.collection.name} #
                      {selectedListing.tokenId}
                    </strong>
                    ? <br />
                    It will be no longer available for sale on the marketplace.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <PrimaryButton
                  type="button"
                  disabled={isLoading}
                  onClick={handleCloseModal}
                  className="w-full"
                >
                  Keep It
                </PrimaryButton>
                <PrimaryButton
                  type="button"
                  className="bg-red-800 hover:bg-red-900 w-full"
                  disabled={isLoading}
                  onClick={() =>
                    handleSubmit(
                      selectedListing.collectionId,
                      selectedListing.tokenId,
                    )
                  }
                >
                  {isLoading ? "Canceling..." : "Cancel It"}
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
    </section>
  );
};
