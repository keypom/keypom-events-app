import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import { Journey } from "@/lib/api/journeys";
import eventHelperInstance, { ExtClaimedDrop, DropData } from "@/lib/event";
import { RecoveredAccountInfo } from "@/lib/helpers/events";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";
import { useEventCredentials } from "@/stores/event-credentials";
import { useQuery } from "@tanstack/react-query";

export interface AccountData {
  accountId: string;
  displayAccountId: string;
  ownedCollectibles: ExtClaimedDrop[];
  unownedCollectibles: DropData[];
  journeys: Journey[];
  balance: string;
  tokensCollected: string;
}

const sortJourneys = (journeys: Journey[]): Journey[] => {
  return journeys.sort((a, b) => {
    const aCompletedSteps = a.steps.filter((step) => step.completed).length;
    const bCompletedSteps = b.steps.filter((step) => step.completed).length;
    const aTotalSteps = a.steps.length;
    const bTotalSteps = b.steps.length;
    const aCompletionRatio = aCompletedSteps / aTotalSteps;
    const bCompletionRatio = bCompletedSteps / bTotalSteps;

    // Completed journeys go first, sorted by total steps (descending)
    if (a.completed && b.completed) {
      return bTotalSteps - aTotalSteps;
    } else if (a.completed) {
      return -1;
    } else if (b.completed) {
      return 1;
    }

    // In-progress journeys go next, sorted by highest completion ratio
    if (aCompletedSteps > 0 && bCompletedSteps > 0) {
      return bCompletionRatio - aCompletionRatio;
    }

    // Unstarted journeys go last, sorted by total steps (ascending)
    if (aCompletedSteps === 0 && bCompletedSteps === 0) {
      return aTotalSteps - bTotalSteps;
    }

    return 0;
  });
};

// Helper function to map owned journeys (ExtClaimedDrop)
const mapOwnedJourneyToJourney = (drop: ExtClaimedDrop): Journey => {
  const steps =
    drop.needed_scavenger_ids?.map((piece, stepIndex) => ({
      id: stepIndex + 1,
      title: piece.key,
      description: piece.description,
      completed: drop.found_scavenger_ids?.includes(piece.key) || false,
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
      drop.nft_metadata?.media || drop.image, // Use media from nft_metadata for image
    ),
    isDisabled: drop.creator_has_funds === false,
    tokenReward:
      drop.token_amount &&
      eventHelperInstance.yoctoToNearWithMinDecimals(drop.token_amount),
    steps,
    completed, // Add completed flag
  };
};

// Helper function to map unowned journeys (DropData)
const mapUnownedJourneyToJourney = (drop: DropData): Journey => {
  const steps =
    drop.scavenger_hunt?.map((piece, stepIndex) => ({
      id: stepIndex + 1,
      title: piece.key,
      description: piece.description,
      completed: false, // Unowned journeys don't have any found pieces
    })) || [];

  const totalCount = drop.scavenger_hunt?.length || 0;

  return {
    id: drop.id, // Use drop ID as journey ID
    title: drop.name,
    description: `0 of ${totalCount} found`, // No pieces found for unowned journeys
    imageSrc: getIpfsImageSrcUrl(
      drop.nft_metadata?.media || drop.image, // Use media from nft_metadata for image
    ),
    isDisabled: drop.creator_has_funds === false,
    tokenReward:
      drop.token_amount &&
      eventHelperInstance.yoctoToNearWithMinDecimals(drop.token_amount),
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
    eventHelperInstance.debugLog(`allDrops: ${allDrops}`, "log");

    const foundNFTDrops: ExtClaimedDrop[] = await eventHelperInstance.viewCall({
      methodName: "get_claimed_nfts_for_account",
      args: { account_id: accountId },
    });

    // Modify unownedCollectibles to exclude owned items
    const ownedNFTs = foundNFTDrops.filter(
      (drop) =>
        (drop.found_scavenger_ids || []).length ===
        (drop.needed_scavenger_ids || []).length,
    );

    const ownedMultichainNFTs: ExtClaimedDrop[] = (
      await eventHelperInstance.viewCall({
        methodName: "get_claimed_multichain_nfts_for_account",
        args: { account_id: accountId },
      })
    ).filter(
      (drop) =>
        (drop.found_scavenger_ids || []).length ===
        (drop.needed_scavenger_ids || []).length,
    );

    const ownedCollectibles = [...ownedNFTs, ...ownedMultichainNFTs];

    // Modify unownedCollectibles to exclude owned items
    const unownedCollectibles = allDrops.filter(
      (drop) =>
        "nft_metadata" in drop &&
        drop.scavenger_hunt === null &&
        drop.type !== "Token" &&
        !ownedCollectibles.some((ownedItem) => ownedItem.drop_id === drop.id),
    );

    const ownedJourneys: ExtClaimedDrop[] = await eventHelperInstance.viewCall({
      methodName: "get_claimed_scavengers_for_account",
      args: { account_id: accountId },
    });

    const unownedJourneys = allDrops.filter(
      (drop) => drop.scavenger_hunt !== null,
    );

    // Filter out unowned journeys that are already owned
    const filteredUnownedJourneys = unownedJourneys.filter(
      (journey) =>
        !ownedJourneys.some(
          (unlockedItem) => unlockedItem.drop_id === journey.id,
        ),
    );

    // Consolidate owned and unowned journeys
    const allJourneys: Journey[] = [
      ...ownedJourneys.map((journey) => mapOwnedJourneyToJourney(journey)),
      ...filteredUnownedJourneys.map((journey) =>
        mapUnownedJourneyToJourney(journey),
      ),
    ];

    // Sort the journeys
    const sortedJourneys = sortJourneys(allJourneys);

    return {
      accountId,
      ownedCollectibles,
      unownedCollectibles,
      tokensCollected: recoveredAccount.ft_collected,
      journeys: sortedJourneys,
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
