import eventHelperInstance, { ExtDropData } from "../event";
import { getIpfsImageSrcUrl } from "../helpers/ipfs";

export interface Collectible {
  id: string;
  title: string;
  description: string;
  assetType: string;
  imageSrc: string;
  isFound: boolean;
}

export const fetchCollectibleById: (
  id: string,
) => Promise<Collectible> = async (id) => {
  const dropInfo: ExtDropData = await eventHelperInstance.viewCall({
    methodName: "get_drop_information",
    args: { drop_id: id },
  });
  console.log(dropInfo);

  if (dropInfo?.nft_metadata === undefined) {
    throw new Error("Incorrect drop metadata. Found token, expected NFT");
  }

  return {
    id,
    title: dropInfo.nft_metadata.title,
    description: dropInfo.nft_metadata.description,
    assetType: "poap",
    imageSrc: getIpfsImageSrcUrl(dropInfo.nft_metadata?.media || ""),
    isFound: true,
  };
};
