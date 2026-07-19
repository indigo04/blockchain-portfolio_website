export async function fetchCollections(address: string | undefined) {
  if (!address) return 0;

  const url = process.env.NEXT_PUBLIC_API_URL || "";

  const query = `
    query MyQuery($address: String!) {
        collectionCreateds (
          orderBy: block_ASC,
          where: { 
            creator_eq: $address 
          }
        ) {
            id
            block
            collectionAddress
            creator
            name
            symbol
            txHash
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

    const res = result.data?.collectionCreateds;

    return res;
  } catch (error) {
    console.error("Error:", error);
  }
}
