export async function fetchTokenTransactions() {
  const url = process.env.NEXT_PUBLIC_API_URL || "";

  const query = `
    query MyQuery {
        minteds (
          orderBy: block_DESC,
          limit: 3, 
        ) {
            id
            block
            amount
            to
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
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    const res = result.data?.minteds;

    return res;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(`Error: ${error}`);
  }
}
