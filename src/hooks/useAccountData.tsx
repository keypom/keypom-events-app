import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import { Journey } from "@/lib/api/journeys";
import eventHelperInstance, { ExtClaimedDrop, ExtDropData } from "@/lib/event";
import { decryptStoredData } from "@/lib/helpers/crypto";
import { RecoveredAccountInfo } from "@/lib/helpers/events";
import { useEventCredentials } from "@/stores/event-credentials";
import { getPubFromSecret } from "@keypom/core";
import { useQuery } from "@tanstack/react-query";

export interface UserData {
  name: string;
  email: string;
}

export interface AccountData {
  accountId: string;
  displayAccountId: string;
  userData: UserData;
  ownedCollectibles: ExtClaimedDrop[];
  unownedCollectibles: ExtDropData[];
  journeys: Journey[];
  balance: string;
}

// Helper function to map owned journeys (ExtClaimedDrop)
const mapOwnedJourneyToJourney = (drop: ExtClaimedDrop): Journey => {
  const steps =
    drop.needed_scavenger_ids?.map((piece, stepIndex) => ({
      id: stepIndex + 1,
      title: piece.piece,
      description: piece.description,
      completed: drop.found_scavenger_ids?.includes(piece.piece) || false,
    })) || [];

  const foundCount = drop.found_scavenger_ids?.length || 0;
  const totalCount = drop.needed_scavenger_ids?.length || 0;

  // Check if all pieces have been found
  const completed = foundCount === totalCount;

  return {
    id: drop.drop_id, // Use drop ID as journey ID
    title: drop.name,
    description: `${foundCount} of ${totalCount} found`, // Shows pieces found
    imageSrc: drop.image, // Assuming this field holds the image URL
    steps,
    completed, // Add completed flag
  };
};

// Helper function to map unowned journeys (ExtDropData)
const mapUnownedJourneyToJourney = (drop: ExtDropData): Journey => {
  const steps =
    drop.scavenger_hunt?.map((piece, stepIndex) => ({
      id: stepIndex + 1,
      title: piece.piece,
      description: piece.description,
      completed: false, // Unowned journeys don't have any found pieces
    })) || [];

  const totalCount = drop.scavenger_hunt?.length || 0;

  return {
    id: drop.drop_id, // Use drop ID as journey ID
    title: drop.name,
    description: `0 of ${totalCount} found`, // No pieces found for unowned journeys
    imageSrc: drop.nft_metadata?.media || "", // Use media from nft_metadata for image
    steps,
    completed: false, // Unowned journeys are never completed
  };
};

const fetchAccountData = async (secretKey: string) => {
  try {
    const pubKey = getPubFromSecret(`ed25519:${secretKey}`);

    const recoveredAccount: RecoveredAccountInfo =
      await eventHelperInstance.viewCall({
        methodName: "recover_account",
        args: { key_or_account_id: pubKey },
      });
    if (!recoveredAccount) {
      throw new Error("Account not found");
    }
    const tokensAvailable = eventHelperInstance.yoctoToNearWith4Decimals(
      recoveredAccount.ft_balance,
    );

    const attendeeKeyInfo = await eventHelperInstance.viewCall({
      methodName: "get_key_information",
      args: { key: pubKey },
    });
    const decryptedMetadata = decryptStoredData(
      secretKey,
      attendeeKeyInfo.metadata,
    );
    const userData = JSON.parse(decryptedMetadata);

    const accountId = recoveredAccount.account_id;
    const ownedCollectibles: ExtClaimedDrop[] =
      await eventHelperInstance.viewCall({
        methodName: "get_claimed_nfts_for_account",
        args: { account_id: accountId },
      });
    const ownedJourneys: ExtClaimedDrop[] = await eventHelperInstance.viewCall({
      methodName: "get_claimed_scavengers_for_account",
      args: { account_id: accountId },
    });
    const allNFTs = await eventHelperInstance.getCachedNFTDrops();
    const unownedCollectibles = allNFTs.filter(
      (nft) => nft.scavenger_hunt === null,
    );

    const unownedJourneys = allNFTs.filter(
      (nft) => nft.scavenger_hunt !== null,
    );

    // Consolidate owned and unowned journeys
    const allJourneys: Journey[] = [
      ...ownedJourneys.map((journey) => mapOwnedJourneyToJourney(journey)),
      ...unownedJourneys.map((journey) => mapUnownedJourneyToJourney(journey)),
    ];
    console.log("Journeys: ", allJourneys);

    return {
      accountId,
      userData,
      ownedCollectibles,
      unownedCollectibles,
      journeys: allJourneys,
      displayAccountId: accountId
        .split(".")[0]
        .substring(KEYPOM_TOKEN_FACTORY_CONTRACT),
      balance: tokensAvailable,
    };
  } catch (error) {
    // Re-throw the error to ensure React Query handles it
    return Promise.reject(error);
  }
};

export const useAccountData = () => {
  const { secretKey } = useEventCredentials();

  return useQuery<AccountData, Error>({
    queryKey: ["accountData", secretKey],
    queryFn: async () => await fetchAccountData(secretKey),
    enabled: !!secretKey,
    retry: 3,
  });
};
