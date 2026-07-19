export async function fetchListings(
  page = 1,
  orderBy = "block_DESC",
  search = "",
) {
  const url = process.env.NEXT_PUBLIC_API_URL || "";

  const limit = 12;

  const currentPage = Math.max(1, page);

  const offset = (currentPage - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereCondition: any = {
    status_eq: "Active",
  };

  if (search) {
    whereCondition.collection = {
      OR: [
        { name_containsInsensitive: search },
        { symbol_containsInsensitive: search },
      ],
    };
  }

  const query = `
    query MyQuery(
      $limit: Int!, 
      $offset: Int!, 
      $orderByList: [ListingOrderByInput!], 
      $orderByConn: [ListingOrderByInput!]!,
      $where: ListingWhereInput) {
        listingsConnection(orderBy: $orderByConn, where: $where) {
          totalCount
        }
        listings (
          orderBy: $orderByList,
          limit: $limit,
          offset: $offset,
          where: $where
        ) {
            id
            block
            collectionId
            price
            seller
            status
            tokenId
            txHash
            collection {
              block
              collectionAddress
              creator
              id
              name
              symbol
              txHash
            }
        }
    }
  `;

  try {
    const orderArray = Array.isArray(orderBy) ? orderBy : [orderBy];

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          limit: limit,
          offset: offset,
          orderByList: orderArray,
          orderByConn: orderArray,
          where: whereCondition,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      return { listings: [], totalPages: 1, totalCount: 0 };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const listings = result.data?.listings || [];
    const totalCount = result.data?.listingsConnection?.totalCount || 0;

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return {
      listings,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error("Error:", error);
    throw new Error(`Error: ${error}`);
  }
}
