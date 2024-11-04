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
  "VITE_MULTICHAIN_WORKER_URL",
];
export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID;
console.log("NETWORK_ID", NETWORK_ID);

/**
 * MULTICHAIN NETWORKS
 */
// constants/chains.ts
const isMainnet = NETWORK_ID === "mainnet";
export const MULTICHAIN_NETWORKS = [
  { id: "near", name: "NEAR", icon: "/assets/near_chain.png", chainId: 397 },
  {
    id: "base",
    name: "BASE",
    icon: "/assets/base_chain.png",
    chainId: isMainnet ? 8453 : 84532,
  },
  {
    id: "eth",
    name: "ETHEREUM",
    icon: "/assets/eth_chain.png",
    chainId: isMainnet ? 1 : 20665,
  },
  {
    id: "polygon",
    name: "POLYGON",
    icon: "/assets/polygon_chain.png",
    chainId: isMainnet ? 137 : 80002,
  },
  {
    id: "arbitrum",
    name: "ARBITRUM",
    icon: "/assets/arbitrum_chain.png",
    chainId: isMainnet ? 42161 : 421614,
  },
  {
    id: "optimism",
    name: "OPTIMISM",
    icon: "/assets/optimism_chain.png",
    chainId: isMainnet ? 10 : 11155420,
  },
  {
    id: "binance",
    name: "BSC",
    icon: "/assets/binance_chain.png",
    chainId: isMainnet ? 56 : 97,
  },
];

export const isTestEnv = import.meta.env.MODE === "test";
export const AIRTABLE_WORKER_URL = import.meta.env.VITE_AIRTABLE_WORKER_URL;
export const IPFS_PINNING_WORKER_URL = import.meta.env.VITE_IPFS_WORKER_URL;
export const MULTICHAIN_WORKER_URL = import.meta.env.VITE_MULTICHAIN_WORKER_URL;

export const BLACKLISTED_LEADERBOARD_USERNAMES = ["test-user-1"];

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
  "/me/admin",
  "/leaderboard",

  "/tickets/ticket",
  "/scan/tickets",
];

// Routes that should hide the footer
export const HIDDEN_FOOTER_ROUTES = [
  "/welcome",
  "/nameselect",
  "/tickets/ticket",
  "/scan/tickets",
  "/leaderboard",
  "/me/admin",
  "/offboarding",
];

// Routes that should not have dimension constraints
export const NO_DIMENSION_CONSTRAINT_ROUTES = [
  "/me/admin",
  "/tickets/ticket",
  "/leaderboard",
];

// Routes that should not show the header
export const NO_HEADER_ROUTES = ["/leaderboard"];

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
