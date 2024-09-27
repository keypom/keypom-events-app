import eventHelperInstance, { DropData } from "../event";
import { getIpfsImageSrcUrl } from "../helpers/ipfs";
import { getChainNameFromId } from "../helpers/multichain";

export interface Collectible {
  id: string;
  title: string;
  description: string;
  assetType: string;
  imageSrc: string;
  isFound: boolean;
  chain: string;
}

export const fetchCollectibleById: (
  id: string,
) => Promise<Collectible> = async (id) => {
  const dropInfo: DropData = await eventHelperInstance.viewCall({
    methodName: "get_drop_information",
    args: { drop_id: id },
  });
  console.log(dropInfo);

  let chain = "near"; // Default to NEAR
  if (dropInfo?.mc_metadata !== undefined) {
    chain = getChainNameFromId(dropInfo.mc_metadata.chain_id);
  }

  if (dropInfo?.nft_metadata === undefined) {
    throw new Error("Incorrect drop metadata. Found token, expected NFT");
  }

  return {
    id,
    title: dropInfo.nft_metadata.title || "",
    description: dropInfo.nft_metadata.description || "",
    assetType: "poap",
    imageSrc: getIpfsImageSrcUrl(dropInfo.nft_metadata?.media || ""),
    isFound: true,
    chain: chain,
  };
};
