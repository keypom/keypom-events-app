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

export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID ?? "testnet";
export const isTestEnv = import.meta.env.MODE === "test";
export const CLOUDFLARE_IPFS = "https://cloudflare-ipfs.com/ipfs";

/**
 * KEYPOM
 */
export const KEYPOM_CONTRACTS = {
  testnet: {
    TOKEN_FACTORY_CONTRACT:
      import.meta.env.VITE_CONTRACT_ID || "1726149943938-factory.testnet",
  },
  mainnet: {
    TOKEN_FACTORY_CONTRACT: import.meta.env.VITE_CONTRACT_ID || "TODO",
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
