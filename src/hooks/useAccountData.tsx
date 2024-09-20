import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import { Journey } from "@/lib/api/journeys";
import eventHelperInstance, { ExtClaimedDrop, ExtDropData } from "@/lib/event";
import { RecoveredAccountInfo } from "@/lib/helpers/events";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";
import { useEventCredentials } from "@/stores/event-credentials";
import { useQuery } from "@tanstack/react-query";

export interface AccountData {
  accountId: string;
  displayAccountId: string;
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
    imageSrc: getIpfsImageSrcUrl(
      drop.nft_metadata?.media || "", // Use media from nft_metadata for image
    ),
    tokenReward:
      drop.amount &&
      eventHelperInstance.yoctoToNearWithMinDecimals(drop.amount),
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
    imageSrc: getIpfsImageSrcUrl(
      drop.nft_metadata?.media || "", // Use media from nft_metadata for image
    ),
    tokenReward:
      drop.amount &&
      eventHelperInstance.yoctoToNearWithMinDecimals(drop.amount),
    steps,
    completed: false, // Unowned journeys are never completed
  };
};

const fetchAccountData = async (secretKey: string) => {
  try {
    const pubKey = eventHelperInstance.getPubFromSecret(secretKey);

    const recoveredAccount: RecoveredAccountInfo =
      await eventHelperInstance.viewCall({
        methodName: "recover_account",
        args: { key_or_account_id: pubKey },
      });
    if (!recoveredAccount) {
      throw new Error("Account not found");
    }
    const tokensAvailable = eventHelperInstance.yoctoToNearWith2Decimals(
      recoveredAccount.ft_balance,
    );

    const accountId = recoveredAccount.account_id;
    const allDrops = await eventHelperInstance.getCachedDrops();

    const ownedCollectibles: ExtClaimedDrop[] =
      await eventHelperInstance.viewCall({
        methodName: "get_claimed_nfts_for_account",
        args: { account_id: accountId },
      });

    const unownedCollectibles = allDrops.filter(
      (drop) => "nft_metadata" in drop && drop.scavenger_hunt === null,
    );

    const ownedJourneys: ExtClaimedDrop[] = await eventHelperInstance.viewCall({
      methodName: "get_claimed_scavengers_for_account",
      args: { account_id: accountId },
    });

    const unownedJourneys = allDrops.filter(
      (drop) => drop.scavenger_hunt !== null,
    );
    // Filter out locked items that have the same drop_id as any unlocked item
    const filteredUnownedJourneys = unownedJourneys.filter(
      (journey) =>
        !ownedJourneys.some(
          (unlockedItem) => unlockedItem.drop_id === journey.drop_id,
        ),
    );

    // Consolidate owned and unowned journeys
    const allJourneys: Journey[] = [
      ...ownedJourneys.map((journey) => mapOwnedJourneyToJourney(journey)),
      ...filteredUnownedJourneys.map((journey) =>
        mapUnownedJourneyToJourney(journey),
      ),
    ];
    console.log("Journeys: ", allJourneys);

    return {
      accountId,
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
