import { TelegramIcon } from "@/components/icons";

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
    CORE_CONTRACT: import.meta.env.VITE_CONTRACT_ID || "v2.keypom.testnet",
    EVENTS_CONTRACT: "1724680439172-kp-ticketing.testnet",
    MARKETPLACE_CONTRACT: "1724680439172-marketplace.testnet",
    TOKEN_FACTORY_CONTRACT: "1724680439172-factory.testnet",
  },
  mainnet: {
    CORE_CONTRACT: import.meta.env.VITE_CONTRACT_ID || "TODO",
    EVENTS_CONTRACT: "TODO",
    MARKETPLACE_CONTRACT: "TODO",
    TOKEN_FACTORY_CONTRACT: "TODO",
  },
};
export const KEYPOM_EVENTS_CONTRACT =
  KEYPOM_CONTRACTS[NETWORK_ID].EVENTS_CONTRACT;
export const KEYPOM_MARKETPLACE_CONTRACT =
  KEYPOM_CONTRACTS[NETWORK_ID].MARKETPLACE_CONTRACT;
export const KEYPOM_TOKEN_FACTORY_CONTRACT =
  KEYPOM_CONTRACTS[NETWORK_ID].TOKEN_FACTORY_CONTRACT;

export const KEYPOM_MASTER_KEY = "MASTER_KEY";

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

export const EVENT_IMG_DIR_FOLDER_NAME = "redacted";

export const CONTACT_BUTTON = {
  href: "https://t.me/redactedbangkok",
  label: "Telegram",
  icon: TelegramIcon,
};
