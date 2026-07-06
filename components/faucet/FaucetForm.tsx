"use client";

import { useState } from "react";
import { PrimaryButton } from "../shared/PrimaryButton";
import { useAccount } from "wagmi";

export const FaucetForm = () => {
  const [tokens, setTokens] = useState("");
  const { isConnected } = useAccount();
  console.log(isConnected);
  return (
    <form className="p-4 xl:shrink-0 xl:w-xs w-full bg-surface rounded-xl border flex flex-col gap-2 border-muted/25">
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
          className="p-3 pr-15 truncate border text-text border-muted/25 rounded-xl outline-none"
          placeholder="100"
          autoComplete="off"
        />
        <span className="absolute top-9.25 right-1 rounded-xl font-bold text-primary bg-primary/20 p-2">
          $WIL
        </span>
      </div>
      <PrimaryButton
        type="submit"
        disabled={!isConnected || tokens.length === 0}
      >
        Mint Tokens
      </PrimaryButton>
      {!isConnected && (
        <p className="text-muted text-md">Connect your wallet</p>
      )}
    </form>
  );
};
