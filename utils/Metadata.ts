import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import abi from "../abi/NftToken.json";

const gatewayURL = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "";
const rpcURL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcURL),
});

export function formatIpfsUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", `https://${gatewayURL}/ipfs/`);
  }
  return url;
}

export async function fetchNftImage(
  collectionAddress: string,
  tokenId: string,
): Promise<string | null> {
  try {
    const tokenUri = await publicClient.readContract({
      address: collectionAddress as `0x${string}`,
      abi: abi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });

    if (!tokenUri) return null;

    const httpUrl = formatIpfsUrl(String(tokenUri));

    const response = await fetch(httpUrl);
    const metadata = await response.json();

    return formatIpfsUrl(metadata.image);
  } catch (error) {
    console.error(`Error ${collectionAddress} #${tokenId}:`, error);
    return null;
  }
}
