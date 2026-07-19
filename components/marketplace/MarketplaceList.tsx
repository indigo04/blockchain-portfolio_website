"use client";

import { ListingWithImage } from "@/types/Listing";
import { MarketplaceItem } from "./MarketplaceItem";
import { Suspense, useEffect, useState } from "react";
import { Field } from "../shared/Field";
import Dropdown from "../shared/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "../shared/Pagination";

type Props = {
  listings: ListingWithImage[];
  totalPages: number;
};

export const MarketplaceList = ({ listings, totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const dropdownOptions = [
    { label: "Recent", value: "recent" },
    { label: "Oldest", value: "oldest" },
    {
      label: "Most expensive",
      value: "expensive",
    },
    {
      label: "Cheapest",
      value: "cheapest",
    },
  ];

  useEffect(() => {
    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentSearchInUrl = currentUrlParams.get("search") || "";

    if (search === currentSearchInUrl) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, router]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Field
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search by collection name or symbol..."
        />
        <Suspense fallback="Loading params...">
          <Dropdown paramName="query" options={dropdownOptions} />
        </Suspense>
      </div>
      <div
        id="marketplace"
        className="grid grid-cols-1 gap-4 xl:gap-8 md:grid-cols-2 xl:grid-cols-4"
      >
        {listings.map((item) => (
          <MarketplaceItem listing={item} key={item.id} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </section>
  );
};
