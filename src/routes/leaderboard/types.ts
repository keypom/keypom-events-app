// types.ts
export type AccountId = string;

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
  poap_leaderboard: Array<[AccountId, number]>;
  token_leaderboard: Array<[AccountId, string]>;
  recent_transactions: Array<TransactionType>;
  total_tokens_transferred: string;
  total_transactions: number;
}
