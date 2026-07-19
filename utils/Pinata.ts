import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export async function postNftForm(image: File) {
  try {
    const uploadRes = await pinata.upload.public.file(image);
    const imageCID = uploadRes.cid;

    const metadata = {
      image: `ipfs://${imageCID}`,
    };

    const fileName = `${Date.now()}.json`;
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const metadataFile = new File([blob], fileName, {
      type: "application/json",
    });

    const uploadMetadata = await pinata.upload.public.fileArray([metadataFile]);

    const folderCID = uploadMetadata.cid;

    return {
      imageCID: imageCID,
      folderCID: folderCID,
      tokenURI: `ipfs://${folderCID}/${fileName}`,
    };
  } catch (e) {
    console.error("Upload error:", e);
    return null;
  }
}
