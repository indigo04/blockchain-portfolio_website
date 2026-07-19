"use client";

import { useAccount } from "wagmi";
import { UserConnect } from "./UserConnect";
import { UserStatistics } from "./UserStatistics";
import { UserCollectionForm } from "./UserCollectionForm";
import { UserNftForm } from "./UserNftForm";
import { UserCollections } from "./UserCollections";
import { UserOffers } from "./UserOffers";
import { UserListingForm } from "./UserListingForm";

export const UserWrapper = () => {
  const { isConnected } = useAccount();
  if (!isConnected) return <UserConnect />;
  return (
    <>
      <UserStatistics />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <UserCollectionForm />
        <UserNftForm />
        <UserListingForm />
      </div>
      <UserCollections />
      <UserOffers />
    </>
  );
};
