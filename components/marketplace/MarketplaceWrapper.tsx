import { Listing } from "@/types/Listing";
import { fetchListings } from "@/utils/FetchListings";
import { MarketplaceList } from "./MarketplaceList";
import { fetchNftImage } from "@/utils/Metadata";
import { cacheLife, cacheTag } from "next/cache";

const SORT_MAP: Record<string, string> = {
  recent: "block_DESC",
  oldest: "block_ASC",
  expensive: "price_DESC",
  cheapest: "price_ASC",
};

type Props = {
  searchParams: Promise<{ query?: string; search?: string; page?: string }>;
};

export const MarketplaceWrapper = async ({ searchParams }: Props) => {
  const resolvedParams = searchParams ? await searchParams : {};
  const sortQuery = resolvedParams.query || "recent";
  const searchQuery = resolvedParams.search || "";
  const page = resolvedParams.page || "1";

  const { listings, totalPages } = await getCachedListings(
    sortQuery,
    searchQuery,
    page,
  );

  return <MarketplaceList listings={listings} totalPages={totalPages || 1} />;
};

async function getCachedListings(
  sortQuery: string,
  searchQuery: string,
  page: string,
) {
  "use cache";
  cacheTag("marketplace");

  if (searchQuery) {
    cacheLife("minutes");
  } else {
    cacheLife("hours");
  }

  const graphQlOrderBy = SORT_MAP[sortQuery] || "block_DESC";
  const { listings, totalPages } = (await fetchListings(
    Number(page),
    graphQlOrderBy,
    searchQuery,
  )) || { listings: [], totalPages: 1 };

  const safeListings = listings || [];

  const enriched = await Promise.all(
    safeListings.map(async (listing: Listing) => {
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

  return { listings: enriched, totalPages };
}
