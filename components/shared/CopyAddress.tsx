"use client";

import { CopyIcon } from "@/icons/CopyIcon";
import { useState } from "react";

export const CopyAddress = ({ address }: { address: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isCopied) return <p className="text-primary">Copied!</p>;
  return (
    <span
      className="cursor-pointer text-primary"
      onClick={(e) => handleCopy(e)}
    >
      <CopyIcon />
    </span>
  );
};
