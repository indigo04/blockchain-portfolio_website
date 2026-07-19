import { Collection } from "./Collection";

export interface Listing {
  block: bigint;
  collectionId: string;
  id: string;
  price: string;
  seller: string;
  status: "Active" | "Sold" | "Cancelled";
  tokenId: string;
  txHash: string;
  collection: Collection;
}

export type ListingWithImage = Listing & { imageUrl?: string | null };
