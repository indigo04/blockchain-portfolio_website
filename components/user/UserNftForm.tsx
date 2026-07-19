"use client";

import Image from "next/image";
import { PrimaryButton } from "../shared/PrimaryButton";
import image from "../../assets/nft.png";
import { SubmitEvent, useRef, useState } from "react";
import { StarsIcon } from "@/icons/StarsIcon";
import { FileIcon } from "@/icons/FileIcon";
import { Field } from "../shared/Field";
import { Modal } from "../shared/Modal";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "../../abi/NftToken.json";
import { postNftForm } from "@/utils/Pinata";
import { SuccessModalContent } from "../shared/SuccessModalContent";
import { ErrorModalContent } from "../shared/ErrorModalContent";

export const UserNftForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const [isPinataUploading, setIsPinataUploading] = useState(false);

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

  const isLoading = isPending || isConfirming || isPinataUploading;
  const hasError = isWriteError || isConfirmError;

  let currentModal: "form" | "success" | "error" | null = null;

  if (isSuccess) {
    currentModal = "success";
  } else if (hasError) {
    currentModal = "error";
    setIsPinataUploading(false);
  } else if (isFormOpen) {
    currentModal = "form";
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert("File is too large. Maximum size is 100MB.");
      return;
    }
    setFile(selectedFile);
    console.log("Selected file:", selectedFile.name);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    if (!file) return alert("Please upload a file first.");

    e.preventDefault();

    if (isLoading) return;

    reset();
    setIsPinataUploading(true);
    try {
      const res = await postNftForm(file);

      if (!res) throw new Error("Upload error on IPFS");

      const { tokenURI } = res;

      setIsPinataUploading(false);

      writeContract({
        abi: abi,
        address: collectionAddress as `0x${string}`,
        functionName: "safeMint",
        args: [address, tokenURI],
      });

      setFile(null);
      setCollectionAddress("");
    } catch (error) {
      setIsPinataUploading(false);
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
                  Mint New Token
                </h2>
                <p className="text-sm text-muted leading-relaxed max-w-90">
                  Upload your NFT file to mint a new token and add it to your
                  collection.
                </p>
              </div>
            </div>

            <hr className="border-white/5 mb-4" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Field
                label="Collection Address"
                disabled={isLoading}
                value={collectionAddress}
                onChange={(e) => setCollectionAddress(e.target.value)}
                placeholder="Enter collection address"
                id="CollectionAddress"
              />

              <input
                ref={fileInputRef}
                disabled={isLoading}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/gif, video/mp4"
                onChange={handleFileChange}
              />

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`group relative flex flex-col items-center justify-center text-center border-2 border-dashed rounded-2xl p-4 md:p-8 cursor-pointer transition-all md:min-h-55 ${
                  isDragActive
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                    : "border-primary/40 hover:border-primary/80 bg-[#14121a]/50"
                }`}
              >
                <div className="text-primary mb-4 transition-transform group-hover:scale-110 duration-200">
                  <FileIcon />
                </div>

                <h3 className="text-base font-semibold text-white tracking-wide mb-1">
                  {file ? `Selected: ${file.name}` : "Upload your file"}
                </h3>
                <p className="text-sm text-muted max-w-xs mb-1.5">
                  Drag and drop your file here, or click to browse.
                </p>
                <p className="text-xs text-muted tracking-wider uppercase font-medium">
                  PNG, JPG, GIF, MP4 up to 100MB
                </p>
              </div>

              <PrimaryButton
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.45)]"
              >
                <StarsIcon />
                {isLoading ? "Minting..." : "Mint Token"}
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
          <h3 className="text-white text-xl font-bold">Mint New NFT</h3>
          <p className="text-muted text-sm">
            Add unique NFTs to your collection.
          </p>
        </div>
        <PrimaryButton onClick={() => setIsFormOpen(true)}>
          Mint NFT
        </PrimaryButton>
      </div>
      <Image src={image} alt="nft-image" className="object-contain" />
    </section>
  );
};
