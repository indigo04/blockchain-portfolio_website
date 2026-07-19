import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceWrapper } from "@/components/marketplace/MarketplaceWrapper";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default function Home({ searchParams }: PageProps) {
  return (
    <>
      <MarketplaceHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <MarketplaceWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}
