type AllDayEvent = string;
interface MultiDayEvent {
  from: string;
  to: string;
}
export interface EventDateInfo {
  time?: string;
  date: AllDayEvent | MultiDayEvent;
}

export interface QuestionInfo {
  required: boolean;
  question: string;
}

export interface EventStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: { base: string; md: string } | string;
  border?: string;
  bg?: string;
  fontWeight?: string;
  h?: string;
  sx?: object;
  text?: string;
  image?: string;
}

export interface EventStyles {
  title: EventStyle;
  h1: EventStyle;
  h2: EventStyle;
  h3: EventStyle;
  buttons: {
    primary: EventStyle;
    secondary: EventStyle;
  };
  border: EventStyle;
  icon: EventStyle;
  background: string;
}

export interface QRPage {
  showTitle: boolean;
  showLocation: boolean;
  showDate: boolean;
  dateUnderQR: boolean;
  showDownloadButton: boolean;
  showSellTicketButton: boolean;
  sellableThroughText: boolean;
}

export interface WelcomePage {
  title: EventStyle;
}

export interface FunderEventMetadata {
  // Stage 0
  nearCheckout: boolean;

  // Stage 1
  name: string;
  id: string;
  description: string;
  location: string;
  date: DateAndTimeInfo;
  artwork: string;
  dateCreated: string;

  // Stage 2
  questions?: QuestionInfo[];

  // If there are some questions, then we need to encrypt the answers
  pubKey?: string;
  encPrivKey?: string;
  iv?: string;
  salt?: string;

  styles: EventStyles;
  qrPage: QRPage;
  welcomePage: WelcomePage;
}

export type AssetType = null;
export interface AssetConfig {
  permissions: "claim" | "create_account_and_claim";
  root_account_id: string;
}

export interface ExtAssetData {
  uses: number;
  assets: AssetType[];
  config: AssetConfig;
}

export interface EventDrop {
  drop_id: string;
  funder_id: string;
  max_key_uses: number;
  asset_data: ExtAssetData[];
  drop_config: {
    nft_keys_config: {
      token_metadata: TicketInfoMetadata;
    };
  };
}

export interface DateAndTimeInfo {
  startDate: number; // Milliseconds from Unix Epoch

  startTime?: string; // Raw time string such as 9:00 AM
  // For single day events, toDay is not required
  endDate?: number; // Milliseconds from Unix Epoch
  endTime?: string; // Raw time string such as 9:00 AM
}

export interface TicketMetadataExtra {
  eventId: string;
  dateCreated: string;
  salesValidThrough: DateAndTimeInfo;
  passValidThrough: DateAndTimeInfo;
  price: string;
  priceUSD?: string;
  limitPerUser: number;
  maxSupply?: number;
}

export interface TicketInfoMetadata {
  title: string;
  description: string;
  media: string; // CID to IPFS. To render, use `${CLOUDFLARE_IPDS}/${media}`
  extra: string; // Stringified TicketMetadataExtra
}

/// Maps UUID to Event Metadata
export type FunderMetadata = Record<string, FunderEventMetadata>;

export function isValidTicketNFTMetadata(tokenMetadata: TicketInfoMetadata) {
  try {
    const extraMetadata: TicketMetadataExtra = JSON.parse(tokenMetadata.extra);

    // Check if all required properties exist and are of type 'string'
    return (
      typeof tokenMetadata.title === "string" &&
      typeof tokenMetadata.description === "string" &&
      typeof tokenMetadata.media === "string" &&
      typeof extraMetadata.price === "string" &&
      typeof extraMetadata.salesValidThrough === "object" &&
      typeof extraMetadata.passValidThrough === "object" &&
      typeof extraMetadata.salesValidThrough.startDate === "number"
    );
  } catch (e) {
    return false;
  }
}

export const defaultEventInfo: FunderEventMetadata = {
  nearCheckout: false,
  name: "Loading...",
  id: "loading",
  description: "Loading description...",
  location: "Loading location...",
  date: { startDate: Date.now() },
  artwork: "loading",
  dateCreated: new Date().toISOString(),
  questions: [],
  styles: {
    title: {
      color: "grey",
      fontFamily: "Arial",
      fontSize: { base: "16px", md: "24px" },
    },
    h1: {
      color: "grey",
      fontFamily: "Arial",
      fontSize: { base: "20px", md: "28px" },
    },
    h2: {
      color: "grey",
      fontFamily: "Arial",
      fontSize: { base: "18px", md: "26px" },
    },
    h3: {
      color: "grey",
      fontFamily: "Arial",
      fontSize: { base: "16px", md: "24px" },
    },
    buttons: {
      primary: {
        color: "white",
        bg: "blue",
        fontFamily: "Arial",
        fontSize: "16px",
      },
      secondary: {
        color: "black",
        bg: "grey",
        fontFamily: "Arial",
        fontSize: "16px",
      },
    },
    border: { color: "grey", border: "1px solid grey" },
    icon: { color: "grey", fontSize: "24px" },
    background: "loading",
  },
  qrPage: {
    showTitle: true,
    showLocation: true,
    showDate: true,
    dateUnderQR: false,
    showDownloadButton: true,
    showSellTicketButton: true,
    sellableThroughText: true,
  },
  welcomePage: {
    title: { color: "grey", fontFamily: "Arial", fontSize: "24px" },
  },
};

export const defaultDropInfo: EventDrop = {
  drop_id: "loading",
  funder_id: "loading",
  max_key_uses: 0,
  asset_data: [
    {
      uses: 0,
      assets: [],
      config: { root_account_id: "loading", permissions: "claim" },
    },
  ],
  drop_config: {
    nft_keys_config: {
      token_metadata: {
        title: "Loading...",
        description: "Loading description...",
        media: "loading",
        extra: JSON.stringify({
          eventId: "loading",
          dateCreated: new Date().toISOString(),
          salesValidThrough: { startDate: Date.now() },
          passValidThrough: { startDate: Date.now() },
          price: "0",
          limitPerUser: 0,
        }),
      },
    },
  },
};

export const defaultTicketInfo: TicketInfoMetadata = {
  title: "Loading...",
  description: "Loading description...",
  media: "loading",
  extra: JSON.stringify({
    eventId: "loading",
    dateCreated: new Date().toISOString(),
    salesValidThrough: { startDate: Date.now() },
    passValidThrough: { startDate: Date.now() },
    price: "0",
    limitPerUser: 0,
  }),
};

export const defaultTicketInfoExtra: TicketMetadataExtra = {
  eventId: "loading",
  dateCreated: new Date().toISOString(),
  salesValidThrough: { startDate: Date.now() },
  passValidThrough: { startDate: Date.now() },
  price: "0",
  limitPerUser: 0,
};

const FIRST_DROP_BASE_COST = BigInt("15899999999999900000000");
const SUBSEQUENT_DROP_BASE_COST = BigInt("14460000000000200000000");
const FUNDER_METADATA_BASE_COST = BigInt("840000000000000000000");
const FIRST_MARKET_DROP_BASE_COST = BigInt("11790000000000000000000");
const SUBSEQUENT_MARKET_DROP_BASE_COST = BigInt("6810000000000000000000");
const YOCTO_PER_BYTE = BigInt("15000000000000000000"); // Includes a 200% safety margin

const BASE_MARKET_BYTES_PER_KEY = BigInt("800");
const METADATA_MARKET_BYTES_PER_KEY = BigInt("900");

export function getByteSize(str: string) {
  return new Blob([str]).size;
}

export const yoctoPerFreeKey = () => {
  return (
    (BASE_MARKET_BYTES_PER_KEY + METADATA_MARKET_BYTES_PER_KEY) * YOCTO_PER_BYTE
  );
};

export const calculateDepositCost = ({
  eventMetadata,
  eventTickets,
  marketTicketInfo,
}: {
  eventMetadata: FunderEventMetadata;
  eventTickets: TicketInfoMetadata[];
  marketTicketInfo: Record<
    string,
    {
      max_tickets: number;
      price: string;
      sale_start?: number;
      sale_end?: number;
    }
  >;
}) => {
  let marketDeposit = FIRST_MARKET_DROP_BASE_COST;
  let dropDeposit = FIRST_DROP_BASE_COST;
  let funderMetaCost = FUNDER_METADATA_BASE_COST;

  // Calculate drop deposit
  dropDeposit += BigInt(eventTickets.length - 1) * SUBSEQUENT_DROP_BASE_COST;
  dropDeposit +=
    BigInt(getByteSize(JSON.stringify(eventTickets))) * YOCTO_PER_BYTE;

  // Calculate funder metadata cost
  funderMetaCost +=
    BigInt(getByteSize(JSON.stringify(eventMetadata))) * YOCTO_PER_BYTE;

  // Initialize market deposit
  marketDeposit +=
    BigInt(Object.keys(marketTicketInfo).length - 1) *
    SUBSEQUENT_MARKET_DROP_BASE_COST;

  let numFreeKeys = 0; // Initialize numFreeKeys as a number
  for (const keyInfo of Object.values(marketTicketInfo)) {
    if (keyInfo.price === "0") {
      numFreeKeys += keyInfo.max_tickets; // Ensure max_tickets is a number
    }
  }

  // Calculate market key cost for free keys (if any)
  marketDeposit +=
    BigInt(numFreeKeys) *
    (BASE_MARKET_BYTES_PER_KEY + METADATA_MARKET_BYTES_PER_KEY) *
    YOCTO_PER_BYTE;

  // Return the total deposit cost
  return {
    costBreakdown: {
      perDrop: (dropDeposit / BigInt(eventTickets.length)).toString(),
      perEvent: funderMetaCost.toString(),
      marketListing: marketDeposit.toString(),
      total: (dropDeposit + funderMetaCost + marketDeposit).toString(),
    },
  };
};
