import * as nearAPI from "near-api-js";
import { NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import getConfig from "@/config/near";
import {
  FinalExecutionStatus,
  FinalExecutionOutcome,
} from "near-api-js/lib/providers";
import { getPubFromSecret } from "@keypom/core";
import { UserData } from "@/stores/event-credentials";

let instance: EventJS | undefined;

const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
const config = getConfig();

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16),
  );
}

export interface AttendeeTicketData {
  ticket: string;
  userData: UserData;
}

export interface ExtClaimedDrop {
  type: "token" | "nft";
  name: string;
  image: string;
  drop_id: string;
  found_scavenger_ids?: string[];
  needed_scavenger_ids?: ScavengerHunt[];
  nft_metadata?: NftMetadata; // Only present if the drop is an NFT
  amount?: string; // Only present if the drop is a token
}

export interface ScavengerHunt {
  piece: string;
  description: string;
}

export interface ExtDropData {
  type: "token" | "nft";
  name: string;
  drop_id: string;
  nft_metadata?: NftMetadata; // Only present if the drop is an NFT
  amount?: string; // Only present if the drop is a token
  scavenger_hunt?: ScavengerHunt[]; // Optional scavenger hunt pieces
}

interface NftMetadata {
  title: string;
  media: string;
  description: string;
}

const connectionConfig = {
  networkId: NETWORK_ID,
  keyStore: myKeyStore,
  nodeUrl: config.nodeUrl,
  walletUrl: config.walletUrl,
  helperUrl: config.helperUrl,
  explorerUrl: config.explorerUrl,
};

class EventJS {
  static instance: EventJS;
  nearConnection!: nearAPI.Near;
  viewAccount!: nearAPI.Account;
  private dropCache: ExtDropData[] = []; // Cache for all drops

  constructor() {
    if (instance !== undefined) {
      throw new Error("New instance cannot be created!!");
    }

    this.init();
  }

  async init() {
    this.nearConnection = await nearAPI.connect(connectionConfig);
    this.viewAccount = await this.nearConnection.account(config.contractId);
  }

  public static getInstance(): EventJS {
    if (
      EventJS.instance == null ||
      EventJS.instance === undefined ||
      !(EventJS.instance instanceof EventJS) ||
      this.instance === undefined
    ) {
      EventJS.instance = new EventJS();
    }

    return EventJS.instance;
  }

  yoctoToNear = (yocto: string) =>
    nearAPI.utils.format.formatNearAmount(yocto, 4);

  yoctoToNearWithMinDecimals = (yoctoString: string) => {
    const divisor = 1e24;
    const near =
      (BigInt(yoctoString) / BigInt(divisor)).toString() +
      "." +
      (BigInt(yoctoString) % BigInt(divisor)).toString().padStart(24, "0");

    const split = near.split(".");
    const integerPart = split[0];
    let decimalPart = split[1].substring(0, 4);

    // Remove trailing zeros in the decimal part, but keep meaningful ones
    decimalPart = decimalPart.replace(/0+$/, "");

    // If there's no remaining decimal part after removing zeros, return only the integer part
    return decimalPart.length > 0
      ? `${integerPart}.${decimalPart}`
      : integerPart;
  };

  yoctoToNearWith2Decimals = (yoctoString: string) => {
    const divisor = 1e24;
    const near =
      (BigInt(yoctoString) / BigInt(divisor)).toString() +
      "." +
      (BigInt(yoctoString) % BigInt(divisor)).toString().padStart(24, "0");

    const split = near.split(".");
    const integerPart = split[0];
    let decimalPart = split[1];

    decimalPart = decimalPart.substring(0, 2);

    return `${integerPart}.${decimalPart}`;
  };

  nearToYocto = (near: string) => nearAPI.utils.format.parseNearAmount(near);

  viewCall = async ({
    contractId = KEYPOM_TOKEN_FACTORY_CONTRACT,
    methodName,
    args,
  }) => {
    const res = await this.viewAccount.viewFunction({
      contractId,
      methodName,
      args,
    });
    return res;
  };

  accountExists = async (accountId: string) => {
    try {
      const userAccount = new nearAPI.Account(
        this.nearConnection.connection,
        accountId,
      );
      await userAccount.state();
      return true;
    } catch (e) {
      if (!/no such file|does not exist/.test((e as string).toString())) {
        throw e;
      }
      return false;
    }
  };

  getPubFromSecret = (secretKey: string) => {
    const strippedSecretKey = secretKey.replace("ed25519:", "");
    const pubKey = getPubFromSecret(`ed25519:${strippedSecretKey}`);
    return pubKey;
  };

  deleteConferenceDrop = async ({
    secretKey,
    dropId,
  }: {
    secretKey: string;
    dropId: string;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );

    await userAccount.functionCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "delete_drop",
      args: {
        drop_id: dropId,
      },
    });
  };

  createConferenceDrop = async ({
    secretKey,
    scavengerHunt,
    isScavengerHunt,
    createdDrop,
  }: {
    secretKey: string;
    isScavengerHunt: boolean;
    scavengerHunt: Array<{ piece: string; description: string }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdDrop: any;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );

    const pinnedDrop = {
      ...createdDrop,
      artwork: "bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy",
    };

    let scavenger_hunt:
      | Array<{ piece: string; description: string }>
      | undefined;
    if (isScavengerHunt) {
      scavenger_hunt = [];
      for (const { description } of scavengerHunt) {
        scavenger_hunt.push({
          description,
          piece: uuidv4(),
        });
      }
    }

    let res: FinalExecutionOutcome | void;

    if (createdDrop.nftData) {
      res = await userAccount.functionCall({
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "create_nft_drop",
        args: {
          drop_data: {
            image: pinnedDrop.artwork,
            name: pinnedDrop.name,
            scavenger_hunt,
          },
          nft_metadata: {
            ...pinnedDrop.nftData,
            media:
              "bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy",
          },
        },
      });
      const status = res?.status as FinalExecutionStatus;
      if (status && status.SuccessValue) {
        // Now we're sure SuccessValue exists and is a string
        let dropId = atob(status.SuccessValue);
        if (dropId.startsWith('"') && dropId.endsWith('"')) {
          dropId = dropId.slice(1, -1);
        }
        return { dropId, completeScavengerHunt: scavenger_hunt };
      } else {
        console.error("SuccessValue is not available");
      }
    }

    res = await userAccount.functionCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "create_token_drop",
      args: {
        drop_data: {
          image: pinnedDrop.artwork,
          name: pinnedDrop.name,
          scavenger_hunt,
        },
        token_amount: this.nearToYocto(pinnedDrop.amount),
      },
    });

    const status = res?.status as FinalExecutionStatus;
    if (status && status.SuccessValue) {
      // Now we're sure SuccessValue exists and is a string
      let dropId = atob(status.SuccessValue);
      if (dropId.startsWith('"') && dropId.endsWith('"')) {
        dropId = dropId.slice(1, -1);
      }
      return { dropId, completeScavengerHunt: scavenger_hunt };
    } else {
      console.error("SuccessValue is not available");
    }
  };

  claimEventDrop = async ({
    secretKey,
    accountId,
    dropId,
    scavId,
  }: {
    secretKey: string;
    dropId: string;
    scavId: string | null;
    accountId?: string;
  }) => {
    // Fetch the drop information
    const dropInfo = await eventHelperInstance.viewCall({
      methodName: "get_drop_information",
      args: { drop_id: dropId },
    });
    console.log("Drop Info in scan: ", dropInfo);

    if (!dropInfo) {
      throw new Error("Drop not found");
    }

    // Fetch claimed drops for the account
    let curClaim: ExtClaimedDrop | null = null;
    try {
      curClaim = await eventHelperInstance.viewCall({
        methodName: "get_claimed_drop_for_account",
        args: { account_id: accountId, drop_id: dropId },
      });
      console.log("Cur Claim: ", curClaim);
    } catch (e) {
      console.log("Error: ", e);
    }
    let alreadyClaimed = false;
    // At this point the drop must exist since if it didnt we panick
    // Now, we need to check if we have already claimed the drop
    if (curClaim) {
      // If there is no scavenger hunt, then we already claimed so panick
      const neededScavengerIds = curClaim.needed_scavenger_ids;
      if (!neededScavengerIds) {
        alreadyClaimed = true;
      } else {
        if (!scavId) {
          throw new Error("No scavenger ID provided");
        }

        // Theres some scavenger hunts so we need to make sure that the one we are trying to claim is valid
        const isValidScavengerId = neededScavengerIds
          .map((item) => item.piece)
          .includes(scavId);

        if (!isValidScavengerId) {
          throw new Error("Invalid scavenger piece");
        }

        // IF the scavenger ID is valid, check if it has already been claimed
        const piecesToCheck = curClaim.found_scavenger_ids || [];
        alreadyClaimed = piecesToCheck.includes(scavId);
      }
    }

    if (alreadyClaimed) {
      throw new Error("You already scanned this drop");
    }

    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );
    await userAccount.functionCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "claim_drop",
      args: {
        drop_id: dropId,
        scavenger_id: scavId,
      },
    });
  };

  sendConferenceTokens = async ({
    secretKey,
    sendTo,
    amount,
  }: {
    secretKey: string;
    sendTo: string;
    amount: number;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );
    await userAccount.functionCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "ft_transfer",
      args: {
        receiver_id: `${sendTo}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`,
        amount: this.nearToYocto(amount.toString()),
      },
    });
  };

  handleScanIntoEvent = async ({ secretKey }: { secretKey: string }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );
    await userAccount.functionCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "scan_ticket",
      args: {},
    });
  };

  handleCreateEventAccount = async ({
    secretKey,
    accountId,
  }: {
    secretKey: string;
    accountId: string;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );
    await userAccount.functionCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "create_account",
      args: {
        new_account_id: accountId,
      },
    });
  };

  // Method to fetch all drops with caching
  fetchDropsWithCache = async () => {
    if (this.dropCache.length > 0) {
      return this.dropCache;
    }

    const numDrops = await this.viewCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "get_num_drops",
      args: {},
    });

    let allDrops: ExtDropData[] = [];
    for (let i = 0; i < numDrops; i += 50) {
      const dropBatch = await this.viewCall({
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "get_drops",
        args: { from_index: i.toString(), limit: 50 },
      });
      allDrops = allDrops.concat(dropBatch);
    }

    this.dropCache = allDrops;
    return allDrops;
  };

  // Filter cached drops for NFTs
  getCachedDrops = async (): Promise<ExtDropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache;
  };

  // Filter cached drops for Tokens
  getCachedTokenDrops = async (): Promise<ExtDropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter((drop) => "amount" in drop);
  };

  // Filter cached drops for scavenger hunts
  getCachedScavengerHunts = async (): Promise<ExtDropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter(
      (drop) => drop.scavenger_hunt && drop.scavenger_hunt.length > 0,
    );
  };
}

const eventHelperInstance = EventJS.getInstance();

export default eventHelperInstance;
