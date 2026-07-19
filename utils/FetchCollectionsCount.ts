export async function fetchCollectionCount(address: string | undefined) {
  if (!address) return 0;

  const url = process.env.NEXT_PUBLIC_API_URL || "";

  const query = `
    query GetCollectionsCount($address: String!) {
        collectionCreatedsConnection(
          orderBy: id_ASC, 
          where: { 
            creator_eq: $address 
          }
        ) {
            totalCount
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

    const totalCount = result.data?.collectionCreatedsConnection?.totalCount;

    return totalCount;
  } catch (error) {
    console.error("Error:", error);
  }
}
