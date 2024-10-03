export interface AttendeeKeyInfo {
  has_scanned: boolean;
  account_id?: string;
  drop_id?: string;
  metadata?: string;
}

export interface TicketTypeInfo {
  account_type: "Basic" | "Sponsor" | "Admin";
  starting_token_balance: string;
  starting_near_balance: string;
}

export interface RecoveredAccountInfo {
  account_id: string;
  ft_balance: string;
  account_type: "Basic" | "Sponsor" | "Admin";
  is_contract_frozen: boolean;
}
