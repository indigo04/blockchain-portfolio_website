"use client";

import { BalanceIcon } from "@/icons/BalanceIcon";
import { CollectionsIcon } from "@/icons/CollectionsIcon";
import { OffersIcon } from "@/icons/OffersIcon";
import { TokenIcon } from "@/icons/TokenIcon";
import { useAccount, useReadContract } from "wagmi";
import abi from "../../abi/WilToken.json";
import { fetchCollectionCount } from "@/utils/FetchCollectionsCount";
import { useQuery } from "@tanstack/react-query";
import { fetchListingsCount } from "@/utils/FetchListingsCount";
import { fetchActiveListingsCount } from "@/utils/FetchActiveListingsCount";
import { UserStatisticsBlock } from "./UserStatisticsBlock";

const TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_ADDRESS ||
  "0x31D9052DfC3A6Ed999a64595B27863E2DDA1d79B";

export const UserStatistics = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const {
    data: collectionsCounter,
    isPending: isCollectionsLoading,
    isError: isCollectionsError,
  } = useQuery({
    queryKey: ["collectionsCounter"],
    queryFn: () => fetchCollectionCount(address),
    throwOnError: true,
  });

  const {
    data: listingsCounter,
    isPending: isListingsLoading,
    isError: isListingsError,
  } = useQuery({
    queryKey: ["listingsCounter"],
    queryFn: () => fetchListingsCount(address),
    throwOnError: true,
  });

  const {
    data: activeListingsCounter,
    isPending: isActiveListingsLoading,
    isError: isActiveListingsError,
  } = useQuery({
    queryKey: ["activeListingsCounter"],
    queryFn: () => fetchActiveListingsCount(address),
    throwOnError: true,
  });

  const statistics = [
    {
      title: "Balance",
      value: isLoading ? "Loading..." : (balance as bigint),
      icon: <BalanceIcon size={36} />,
    },
    {
      title: "Collections",
      value: isCollectionsLoading
        ? "Loading..."
        : isCollectionsError
          ? "Error"
          : collectionsCounter,
      icon: <CollectionsIcon size={36} />,
    },
    {
      title: "Listed NFTs",
      value: isListingsLoading
        ? "Loading..."
        : isListingsError
          ? "Error"
          : listingsCounter,
      icon: <TokenIcon size={36} />,
    },
    {
      title: "Active Offers",
      value: isActiveListingsLoading
        ? "Loading..."
        : isActiveListingsError
          ? "Error"
          : activeListingsCounter,
      icon: <OffersIcon size={36} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl xl:text-5xl font-bold text-white">
        Welcome back! ✌️
      </h1>
      <p className="text-muted text-xl font-bold">
        Manage your collections, NFTs and offers all in one place.
      </p>
      <ul className="list-none grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statistics.map((el) => (
          <UserStatisticsBlock statisticsBlock={el} key={el.title} />
        ))}
      </ul>
    </div>
  );
};
