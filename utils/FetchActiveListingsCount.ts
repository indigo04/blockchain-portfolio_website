export async function fetchActiveListingsCount(address: string | undefined) {
  if (!address) return 0;

  const url = process.env.NEXT_PUBLIC_API_URL || "";

  const query = `
    query GetActiveListingsCount($address: String!) {
        listingsConnection(
          orderBy: id_ASC, 
          where: { 
            status_eq: Active, 
            seller_eq: $address 
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

    const totalCount = result.data?.listingsConnection?.totalCount;

    return totalCount;
  } catch (error) {
    console.error("Error:", error);
  }
}
