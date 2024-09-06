import { TelegramIcon } from "@/components/icons";

export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID ?? "testnet";
export const isTestEnv = import.meta.env.MODE === "test";
export const CLOUDFLARE_IPFS = "https://cloudflare-ipfs.com/ipfs";

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

export const PURCHASED_LOCAL_STORAGE_PREFIX = "TICKETS_PURCHASED";

export const MASTER_KEY = "MASTER_KEY";

export const MAX_FILE_SIZE = 10000000;

export const EVENT_IMG_DIR_FOLDER_NAME = "redacted";

export const WORKER_BASE_URL = "https://keypom-nft-storage.keypom.workers.dev/";
export const EVENTS_WORKER_IPFS_PINNING =
  "https://stripe-worker.kp-capstone.workers.dev/ipfs-pin";
export const EVENTS_WORKER_BASE =
  "https://stripe-worker.kp-capstone.workers.dev";
export const EMAIL_WORKER_BASE = "https://email-worker.kp-capstone.workers.dev";

export const PAGE_SIZE_LIMIT = 5;
export const NFT_ATTEMPT_KEY = "NFT_ATTEMPT";
export const PAGE_QUERY_PARAM = "page";

/**
 * KEYPOM CONTRACTS
 */
export const KEYPOM_EVENTS_CONTRACT = "1724680439172-kp-ticketing.testnet";
export const KEYPOM_MARKETPLACE_CONTRACT = "1724680439172-marketplace.testnet";
export const TOKEN_FACTORY_CONTRACT = "1724680439172-factory.testnet";

export const MIN_NEAR_SELL = 0.1;

export const CONTACT_BUTTON = {
  href: "https://t.me/redactedbangkok",
  label: "Telegram",
  icon: TelegramIcon,
};
