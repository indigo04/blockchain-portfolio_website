export async function fetchUserListings(address: string | undefined) {
  if (!address) return 0;

  const url = process.env.NEXT_PUBLIC_API_URL || "";

  const query = `
    query MyQuery($address: String!) {
        listings (
          orderBy: block_ASC,
          where: { 
            seller_eq: $address 
          }
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { address: address.toLowerCase() },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    const res = result.data?.listings;

    return res;
  } catch (error) {
    console.error("Error:", error);
  }
}
