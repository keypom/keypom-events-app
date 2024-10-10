// types.ts
export type AccountId = string;

export type TopTokenEarnerData = [AccountId, string];
export type TopPoapEarnerData = [AccountId, number];

export interface ClaimTransaction {
  account_id: AccountId;
  reward: string | "NFT";
  timestamp: number;
}

export interface TransferTransaction {
  sender_id: AccountId;
  receiver_id: AccountId;
  amount: string;
  timestamp: number;
}

export interface TransactionType {
  Claim?: ClaimTransaction;
  Transfer?: TransferTransaction;
}

export interface LeaderboardData {
  poap_leaderboard: Array<TopPoapEarnerData | null>;
  token_leaderboard: Array<TopTokenEarnerData | null>;
  recent_transactions: Array<TransactionType | null>;
  total_tokens_transferred: string;
  total_transactions: number;
}
