import {
  AgendaIcon,
  HelpIcon,
  ScanIcon,
  TelegramIcon,
  UserIcon,
  WalletIcon,
} from "@/components/icons";
import { FooterItem } from "@/components/ui/footer";

/**
 * ENVIRONMENT
 */
export const REQUIRED_ENV_VARS = [
  "VITE_CONTRACT_ID",
  "VITE_NETWORK_ID",
  "VITE_AIRTABLE_WORKER_URL",
  "VITE_IPFS_WORKER_URL",
  "VITE_GOOGLE_CLIENT_ID",
];
export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID;
export const isTestEnv = import.meta.env.MODE === "test";
export const AIRTABLE_WORKER_URL = import.meta.env.VITE_AIRTABLE_WORKER_URL;
export const IPFS_PINNING_WORKER_URL = import.meta.env.VITE_IPFS_WORKER_URL;

/**
 * KEYPOM
 */
export const KEYPOM_CONTRACTS = {
  testnet: {
    TOKEN_FACTORY_CONTRACT: import.meta.env.VITE_CONTRACT_ID,
  },
  mainnet: {
    TOKEN_FACTORY_CONTRACT: import.meta.env.VITE_CONTRACT_ID,
  },
};
export const KEYPOM_TOKEN_FACTORY_CONTRACT =
  KEYPOM_CONTRACTS[NETWORK_ID].TOKEN_FACTORY_CONTRACT;

export const DROP_TYPE = {
  TOKEN: "TOKEN",
  TICKET: "TICKET",
  EVENT: "EVENT",
  TRIAL: "TRIAL",
  NFT: "NFT",
  SIMPLE: "SIMPLE",
  OTHER: "OTHER",
} as const;

type DROP_TYPE_KEYS = keyof typeof DROP_TYPE;
export type DROP_TYPES = (typeof DROP_TYPE)[DROP_TYPE_KEYS];

/**
 * APPLICATION
 */

// Routes that are accessible if the user is not authenticated
export const UNAUTHENTICATED_ROUTES = [
  "/agenda",
  "/help",
  // Do not modify below
  "/welcome",
  "/tickets/ticket",
  "/scan/tickets",
];

// Routes that should hide the footer
export const HIDDEN_FOOTER_ROUTES = [
  "/welcome",
  "/tickets/ticket",
  "/scan/tickets",
];

// Footer navigation items for app
export const FOOTER_ITEMS: FooterItem[] = [
  { name: "Help", href: "/help", icon: HelpIcon },
  { name: "Agenda", href: "/agenda", icon: AgendaIcon },
  { name: "Scan", href: "/scan", icon: ScanIcon },
  { name: "Wallet", href: "/wallet", icon: WalletIcon },
  { name: "Me", href: "/me", icon: UserIcon },
];

// Contact button on help page
export const CONTACT_BUTTON = {
  href: "https://t.me/redactedbangkok",
  label: "Telegram",
  icon: TelegramIcon,
};
