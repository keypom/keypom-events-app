import eventHelperInstance, { DropData, ExtClaimedDrop } from "../event";
import { getIpfsImageSrcUrl } from "../helpers/ipfs";
import { getChainNameFromChainId } from "../helpers/multichain";

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
  accountId: string,
) => Promise<Collectible> = async (id, accountId) => {
  const dropInfo: DropData = await eventHelperInstance.viewCall({
    methodName: "get_drop_information",
    args: { drop_id: id },
  });

  let isFound = false;
  try {
    const claimedDrop: ExtClaimedDrop = await eventHelperInstance.viewCall({
      methodName: "get_claimed_drop_for_account",
      args: { drop_id: id, account_id: accountId },
    });
    isFound =
      (claimedDrop.found_scavenger_ids || []).length ===
      (claimedDrop.needed_scavenger_ids || []).length;
  } catch (e) {
    console.log(e);
    isFound = false;
  }
  console.log(dropInfo);

  let chain = "NEAR"; // Default to NEAR
  if (dropInfo?.mc_metadata !== undefined) {
    chain = getChainNameFromChainId(dropInfo.mc_metadata.chain_id);
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
    isFound,
    chain: chain,
  };
};
