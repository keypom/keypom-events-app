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
export const KEYPOM_EVENTS_CONTRACT = "1724680439172-kp-ticketing.testnet";
export const KEYPOM_MARKETPLACE_CONTRACT = "1724680439172-marketplace.testnet";
export const TOKEN_FACTORY_CONTRACT = "1724680439172-factory.testnet";

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
