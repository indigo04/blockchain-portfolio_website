"use client";

import { SliceAddress } from "@/utils/SliceAddress";
import { CopyAddress } from "../shared/CopyAddress";
import { fetchCollections } from "@/utils/FetchCollections";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Collection } from "@/types/Collection";

export const UserCollections = () => {
  const { address } = useAccount();

  const {
    data: collections,
    isPending: isCollectionsLoading,
    isError: isCollectionsError,
  } = useQuery<Collection[]>({
    queryKey: ["collections", address],
    queryFn: () => fetchCollections(address),
    throwOnError: true,
  });

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-white font-bold text-xl xl:text-3xl">
        Your Collections
      </h3>

      {collections && collections.length > 0 && (
        <div className="overflow-x-auto bg-surface py-1 w-full border border-muted/25 rounded-xl">
          <table className="w-full text-center">
            <thead className="text-muted text-nowrap">
              <tr>
                <th className="p-2 px-4"></th>
                <th className="p-2">Name</th>
                <th className="p-2">Symbol</th>
                <th className="p-2">Collection Address</th>
              </tr>
            </thead>
            <tbody className="text-white font-bold">
              {collections.map((el, i) => (
                <tr key={el.id}>
                  <td className="p-1">{i + 1}</td>
                  <td className="p-1">{el.name}</td>
                  <td className="p-1">{el.symbol}</td>
                  <td className="p-1">
                    <div className="flex gap-2 min-w-60 justify-center items-center">
                      {SliceAddress(el.collectionAddress)}
                      <CopyAddress address={el.collectionAddress} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isCollectionsLoading && (
        <p className="text-muted font-bold text-xl">Loading...</p>
      )}
      {isCollectionsError && (
        <p className="text-muted font-bold text-xl">Error</p>
      )}
      {!isCollectionsLoading &&
        !isCollectionsLoading &&
        collections &&
        collections.length === 0 && (
          <p className="text-muted font-bold text-xl">
            Your collection list is empty
          </p>
        )}
    </section>
  );
};
