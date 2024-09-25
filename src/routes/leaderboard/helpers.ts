import eventHelperInstance from "@/lib/event";
import { TransactionType } from "./types";
import { timeAgoShort } from "@/utils/date";

// Helper function to format timestamps
export const formatTimestamp = (
  transactionType: TransactionType,
): string | undefined => {
  if (!transactionType) return;
  const timestamp = transactionType.Claim
    ? transactionType.Claim.timestamp
    : transactionType.Transfer?.timestamp;

  if (!timestamp) return;

  const timestampInMs = timestamp / 1e6;

  return timeAgoShort(new Date(timestampInMs));
};

// Helper function to extract username
export const getUsername = (accountId: string | undefined): string => {
  if (!accountId) return "------";
  return accountId.split(".")[0];
};

// Helper function to format reward message
export const rewardMessage = (tx: TransactionType) => {
  if (tx.Claim !== undefined) {
    if (tx.Claim.reward === "NFT" || tx.Claim.reward === "Multichain POAP") {
      return "Collectible";
    }
    if (tx.Claim.reward === "Scavenger Piece") {
      return "Scavenger Piece";
    }
    return eventHelperInstance.yoctoToNearWith2Decimals(tx.Claim.reward);
  }

  return eventHelperInstance.yoctoToNearWith2Decimals(tx.Transfer!.amount);
};
