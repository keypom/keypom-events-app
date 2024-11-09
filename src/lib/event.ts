import * as nearAPI from "near-api-js";
import {
  NETWORK_ID,
  KEYPOM_TOKEN_FACTORY_CONTRACT,
  MULTICHAIN_WORKER_URL,
  IS_DEBUG_MODE,
} from "@/constants/common";
import getConfig, { NearConfig, RpcEndpoint } from "@/config/near";
import { getPubFromSecret } from "@keypom/core";
import { UserData } from "@/stores/event-credentials";
import { getIpfsImageSrcUrl, pinJsonToIpfs, pinToIpfs } from "./helpers/ipfs";
import { deriveKey, generateSignature } from "./helpers/crypto";
import { getChainIdFromId } from "./helpers/multichain";

let instance: EventJS | undefined;

const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

export interface AttendeeTicketData {
  ticket: string;
  userData: UserData;
}

export interface ExtClaimedDrop {
  type: "token" | "nft" | "multichain";
  name: string;
  image: string;
  drop_id: string;
  key: string;
  found_scavenger_ids?: string[];
  needed_scavenger_ids?: ScavengerHunt[];
  creator_has_funds?: boolean;
  mc_metadata?: MCMetadata;
  nft_metadata?: NftMetadata; // Only present if the drop is an NFT
  token_amount?: string; // Only present if the drop is a token
}

export interface ScavengerHunt {
  id: number;
  key: string;
  description: string;
}

export interface MCMetadata {
  // FOR MPC
  chain_id: number;
  // Receiving NFT contract on external chain
  contract_id: string;
  // Arguments that I pass in to the NFT mint function call on external chain
  // **NEEDS TO HAVE BEEN CREATED ON THE NFT CONTRACT BEFORE CALLING CREATE DROP**
  series_id: number;
}

export interface DropData {
  type: "Token" | "Nft" | "Multichain";
  id: string;
  key: string;
  name: string;
  image: string;
  num_claimed: number;
  scavenger_hunt?: ScavengerHunt[]; // Optional scavenger hunt pieces
  creator_has_funds?: boolean;

  mc_metadata?: MCMetadata;
  nft_metadata?: NftMetadata; // Only present if the drop is an NFT
  token_amount?: string; // Only present if the drop is a token
}

interface NftMetadata {
  title: string;
  media: string;
  description: string;
}

class EventJS {
  static instance: EventJS;
  nearConnection!: nearAPI.Near;
  viewAccount!: nearAPI.Account;
  private dropCache: DropData[] = []; // Cache for all drops
  private config: NearConfig;
  private rpcList: { [key: string]: RpcEndpoint };
  private selectedRpcUrl!: string;

  constructor() {
    if (instance !== undefined) {
      throw new Error("New instance cannot be created!!");
    }

    this.config = getConfig();
    this.rpcList = this.config.rpcList;
    this.init();
  }

  async init() {
    this.selectedRpcUrl = await this.selectBestRpcEndpoint();
    const connectionConfig = {
      networkId: this.config.networkId,
      keyStore: myKeyStore,
      nodeUrl: this.selectedRpcUrl,
      headers: { Referer: "https://beta.rpc.mainnet.near.org" },
      walletUrl: this.config.walletUrl,
      helperUrl: this.config.helperUrl,
      explorerUrl: this.config.explorerUrl,
    };
    this.nearConnection = await nearAPI.connect(connectionConfig);
    this.viewAccount = await this.nearConnection.account(
      this.config.contractId,
    );
  }

  private async selectBestRpcEndpoint(): Promise<string> {
    const rpcEndpoints: RpcEndpoint[] = Object.values(this.rpcList);
    const responseTimes: { [url: string]: number } = {};

    await Promise.all(
      rpcEndpoints.map(async (endpoint: RpcEndpoint) => {
        const time = await this.pingRpc(endpoint.url);
        responseTimes[endpoint.url] = time;
      }),
    );

    // Filter out endpoints that timed out (-1)
    const validEndpoints = Object.entries(responseTimes).filter(
      ([, time]) => time >= 0,
    );

    if (validEndpoints.length === 0) {
      throw new Error("No RPC endpoints are available");
    }

    // Sort by response time
    validEndpoints.sort((a, b) => a[1] - b[1]);

    // Extract the fastest endpoint and log all endpoints with their response times
    const fastestRpcUrl = validEndpoints[0][0];
    const fastestTime = validEndpoints[0][1];

    this.debugLog(
      `Selected RPC: ${fastestRpcUrl} with response time ${fastestTime}ms`,
      "log",
    );

    // Log each RPC endpoint and its response time, along with the difference compared to the fastest
    this.debugLog("RPC Endpoint Response Times:", "log");
    validEndpoints.forEach(([url, time]) => {
      const timeDifference = time - fastestTime;
      this.debugLog(
        ` - ${url}: ${time}ms ${
          timeDifference > 0 ? `(+${timeDifference}ms)` : "(fastest)"
        }`,
        "log",
      );
    });

    return fastestRpcUrl;
  }

  private async pingRpc(url: string): Promise<number> {
    const start = Date.now();
    const timeout = 5000; // 5 seconds timeout

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "ping",
          method: "gas_price",
          params: [null],
        }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        return -1; // Treat non-200 responses as timeouts
      }

      const end = Date.now();
      return end - start;
    } catch (error) {
      return -1; // Timeout or error
    }
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

  debugLog = (message: string, type: "log" | "warn" | "error") => {
    if (IS_DEBUG_MODE === true) {
      console.log(`${type}: ${message}`);
      if (type === "log") {
        console.log(message);
      } else if (type === "warn") {
        console.warn(message);
      } else if (type === "error") {
        console.error(message);
      }
    }
  };

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

  yoctoToNearWith2Decimals = (yoctoString: string): string => {
    const divisor = 1e24;
    const near =
      (BigInt(yoctoString) / BigInt(divisor)).toString() +
      "." +
      (BigInt(yoctoString) % BigInt(divisor)).toString().padStart(24, "0");

    const split = near.split(".");
    const integerPart = split[0];
    let decimalPart = split[1];

    // Format integer part with commas
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ",",
    );

    // Limit decimal part to two digits
    decimalPart = decimalPart.substring(0, 2);

    return `${formattedIntegerPart}.${decimalPart}`;
  };

  nearToYocto = (near: string) => nearAPI.utils.format.parseNearAmount(near);

  viewCall = async ({
    contractId = KEYPOM_TOKEN_FACTORY_CONTRACT,
    methodName,
    args,
  }) => {
    const res = await this.viewFunctionWithRetry({
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

    await this.functionCallWithRetry({
      account: userAccount,
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
  }): Promise<{
    dropId: string;
    dropSecretKey: string;
    scavengerSecretKeys: {
      id: number;
      description: string;
      publicKey: string;
      secretKey: string;
    }[];
  }> => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(NETWORK_ID, KEYPOM_TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_TOKEN_FACTORY_CONTRACT,
    );

    const dropKeyPair = deriveKey(secretKey, createdDrop.name);
    const dropPublicKey = dropKeyPair.publicKey;
    const dropSecretKey = dropKeyPair.secretKey;

    let scavenger_hunt: ScavengerHunt[] | null = [];
    let scavengerSecretKeys: {
      id: number;
      description: string;
      publicKey: string;
      secretKey: string;
    }[] = [];

    if (isScavengerHunt) {
      scavenger_hunt = [];
      scavengerSecretKeys = [];

      for (const [index, piece] of scavengerHunt.entries()) {
        const scavengerId = index + 1;
        const keyPair = deriveKey(
          secretKey,
          createdDrop.name,
          scavengerId.toString(),
        );
        scavenger_hunt.push({
          id: scavengerId,
          key: keyPair.publicKey,
          description: piece.description,
        });
        scavengerSecretKeys.push({
          id: scavengerId,
          description: piece.description,
          publicKey: keyPair.publicKey,
          secretKey: keyPair.secretKey,
        });
      }
    }

    scavenger_hunt = scavenger_hunt.length ? scavenger_hunt : null;

    let res;
    const pinnedImage = await pinToIpfs(createdDrop.artwork);

    if (createdDrop.nftData) {
      if (createdDrop.chain === "near") {
        // NEAR NFT Drop
        res = await this.functionCallWithRetry({
          account: userAccount,
          contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
          methodName: "create_nft_drop",
          args: {
            name: createdDrop.name,
            key: dropPublicKey,
            scavenger_hunt,
            image: pinnedImage,
            nft_metadata: {
              ...createdDrop.nftData,
              media: pinnedImage,
            },
          },
          gas: "300000000000000",
        });
      } else {
        const imageMetadata = {
          name: createdDrop.name,
          description: createdDrop.nftData.description,
          image: getIpfsImageSrcUrl(pinnedImage),
        };
        const pinnedMetadata = await pinJsonToIpfs(imageMetadata);
        this.debugLog(`createDrop: ${createdDrop}`, "log");
        const chain_id = getChainIdFromId(createdDrop.chain);

        const seriesResult = await fetch(
          `${MULTICHAIN_WORKER_URL}/create-series`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: secretKey,
            },
            body: JSON.stringify({
              chain_id,
              hash: pinnedMetadata,
            }),
          },
        );

        if (!seriesResult.ok) {
          throw new Error("Access denied. Contact  an admin for more details");
        }

        const { contract_id, series_id } = await seriesResult.json();

        const multichainMetadata = {
          chain_id,
          contract_id,
          series_id,
        };

        res = await this.functionCallWithRetry({
          account: userAccount,
          contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
          methodName: "create_multichain_drop",
          args: {
            name: createdDrop.name,
            key: dropPublicKey,
            scavenger_hunt,
            image: pinnedImage,
            multichain_metadata: multichainMetadata,
            nft_metadata: {
              ...createdDrop.nftData,
              media: pinnedImage,
            },
          },
          gas: "300000000000000",
        });
      }
    } else {
      // Token Drop
      res = await this.functionCallWithRetry({
        account: userAccount,
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "create_token_drop",
        args: {
          image: pinnedImage,
          name: createdDrop.name,
          key: dropPublicKey,
          scavenger_hunt,
          token_amount: this.nearToYocto(createdDrop.amount),
        },
        gas: "300000000000000",
      });
    }

    const status = res?.status;
    if (status && status.SuccessValue) {
      let dropId = atob(status.SuccessValue);
      if (dropId.startsWith('"') && dropId.endsWith('"')) {
        dropId = dropId.slice(1, -1);
      }
      return {
        dropId,
        dropSecretKey,
        scavengerSecretKeys,
      };
    } else {
      throw new Error("Failed to create drop");
    }
  };

  claimEventDrop = async ({
    secretKey,
    dropSecretKey,
    isScav,
    accountId,
    dropId,
  }: {
    secretKey: string;
    dropId: string;
    dropSecretKey: string;
    isScav: boolean;
    accountId?: string;
  }) => {
    console.log("claimEventDrop", { secretKey, dropId, dropSecretKey });
    const pkToClaim = this.getPubFromSecret(dropSecretKey);
    this.debugLog(`pkToClaim: ${pkToClaim}`, "log");

    // Fetch the drop information
    const dropInfo: DropData = await this.viewCall({
      methodName: "get_drop_information",
      args: { drop_id: dropId },
    });
    this.debugLog(`dropInfo in scan: ${dropInfo}`, "log");

    if (!dropInfo) {
      throw new Error("Drop not found");
    }

    if (dropInfo.creator_has_funds === false) {
      throw new Error(
        "The sponsor ran out of tokens. This drop is no longer available",
      );
    }

    // Fetch claimed drops for the account
    let existingClaimData: ExtClaimedDrop | null = null;
    try {
      existingClaimData = await this.viewCall({
        methodName: "get_claimed_drop_for_account",
        args: { account_id: accountId, drop_id: dropId },
      });
      this.debugLog(`existingClaimData: ${existingClaimData}`, "log");
    } catch (e) {
      this.debugLog(`existingClaimData error: ${e}`, "error");
    }
    let alreadyClaimed = false;

    // At this point the drop must exist since if it didnt we panick
    // Now, we need to check if we have already claimed the drop
    if (existingClaimData) {
      // If there is no scavenger hunt, then we already claimed so panic
      const neededScavengerIds = existingClaimData.needed_scavenger_ids;
      if (!neededScavengerIds) {
        alreadyClaimed = true;
      } else {
        // Theres some scavenger hunts so we need to make sure that the one we are trying to claim is valid
        const isValidScavengerId = neededScavengerIds
          .map((item) => item.key)
          .includes(pkToClaim);

        if (!isValidScavengerId) {
          throw new Error("Invalid scavenger piece");
        }

        // If the scavenger ID is valid, check if it has already been claimed
        const piecesToCheck = existingClaimData.found_scavenger_ids || [];
        alreadyClaimed = piecesToCheck.includes(pkToClaim);
      }
    } else {
      // If there is no existing claim data we need to check if A) the drop key matches and B) if theres a scav, its valid
      if (
        dropInfo.scavenger_hunt !== undefined &&
        dropInfo.scavenger_hunt !== null
      ) {
        const isValidScavengerId = dropInfo.scavenger_hunt
          .map((item) => item.key)
          .includes(pkToClaim);
        if (!isValidScavengerId) {
          throw new Error("Invalid scavenger piece");
        }
      } else {
        if (dropInfo.key !== pkToClaim) {
          throw new Error("QR Code contains an invalid key");
        }
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

    const { signature } = generateSignature(dropSecretKey, accountId!);

    if (dropInfo.mc_metadata) {
      const res = await fetch(`${MULTICHAIN_WORKER_URL}/multichain-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: accountId,
          signature,
          scavenger_id: isScav ? pkToClaim : null,
          secret_key: secretKey,
          drop_secret_key: dropSecretKey,
          drop_id: dropId,
        }),
      });
      if (!res.ok) {
        throw new Error(
          "Failed to claim multichain drop. Reach out to Keypom team",
        );
      }
    } else {
      await this.functionCallWithRetry({
        account: userAccount,
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "claim_drop",
        args: {
          drop_id: dropId,
          signature,
          scavenger_id: isScav ? pkToClaim : null,
        },
      });
    }
  };

  mintConferenceTokens = async ({
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

    await this.functionCallWithRetry({
      account: userAccount,
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "ft_mint",
      args: {
        account_id: `${sendTo}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`,
        amount: this.nearToYocto(amount.toString()),
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

    await this.functionCallWithRetry({
      account: userAccount,
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

    await this.functionCallWithRetry({
      account: userAccount,
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

    await this.functionCallWithRetry({
      account: userAccount,
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

    let allDrops: DropData[] = [];
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
  getCachedDrops = async (): Promise<DropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache;
  };

  // Filter cached drops for Tokens
  getCachedTokenDrops = async (): Promise<DropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter((drop) => "amount" in drop);
  };

  // Filter cached drops for scavenger hunts
  getCachedScavengerHunts = async (): Promise<DropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter(
      (drop) => drop.scavenger_hunt && drop.scavenger_hunt.length > 0,
    );
  };

  // Function Call with Retry Logic
  async functionCallWithRetry({
    account,
    contractId,
    methodName,
    args,
    gas,
    attachedDeposit,
    retryCount = 3,
  }: {
    account: nearAPI.Account;
    contractId: string;
    methodName: string;
    args: any;
    gas?: string;
    attachedDeposit?: string;
    retryCount?: number;
  }) {
    let attempts = 0;
    while (attempts < retryCount) {
      try {
        const result = await account.functionCall({
          contractId,
          methodName,
          args,
          gas,
          attachedDeposit,
        });
        return result;
      } catch (error) {
        attempts++;
        if (attempts >= retryCount) {
          throw error;
        } else {
          this.debugLog(`Function call failed (attempt ${attempts}).`, "warn");
          await this.switchToNextRpcEndpoint();
          // Recreate the account object with the new connection
          account = new nearAPI.Account(
            this.nearConnection.connection,
            account.accountId,
          );
        }
      }
    }
  }

  // View Function with Retry Logic
  async viewFunctionWithRetry({
    contractId = this.config.contractId,
    methodName,
    args,
    retryCount = 3,
  }: {
    contractId?: string;
    methodName: string;
    args: any;
    retryCount?: number;
  }) {
    let attempts = 0;
    while (attempts < retryCount) {
      try {
        const res = await this.viewAccount.viewFunction({
          contractId,
          methodName,
          args,
        });
        return res;
      } catch (error) {
        attempts++;
        if (attempts >= retryCount) {
          throw error;
        } else {
          this.debugLog(
            `View function call failed (attempt ${attempts}).`,
            "warn",
          );
          await this.switchToNextRpcEndpoint();
          // Recreate the viewAccount with the new connection
          this.viewAccount = await this.nearConnection.account(
            this.config.contractId,
          );
        }
      }
    }
  }

  // Switch to Next Best RPC Endpoint
  private async switchToNextRpcEndpoint() {
    // Remove the current RPC endpoint from the list
    const currentRpcUrl = this.selectedRpcUrl;
    const remainingRpcEndpoints = Object.values(this.rpcList).filter(
      (endpoint) => endpoint.url !== currentRpcUrl,
    );

    if (remainingRpcEndpoints.length === 0) {
      throw new Error("No alternative RPC endpoints available");
    }

    // Select the next best RPC endpoint
    const responseTimes: { [url: string]: number } = {};

    await Promise.all(
      remainingRpcEndpoints.map(async (endpoint) => {
        const time = await this.pingRpc(endpoint.url);
        responseTimes[endpoint.url] = time;
      }),
    );

    const validEndpoints = Object.entries(responseTimes).filter(
      ([, time]) => time >= 0,
    );

    if (validEndpoints.length === 0) {
      throw new Error("No RPC endpoints are available");
    }

    // Sort by response time
    validEndpoints.sort((a, b) => a[1] - b[1]);

    // Update the selected RPC endpoint
    this.selectedRpcUrl = validEndpoints[0][0];

    // Reinitialize the nearConnection
    const connectionConfig = {
      networkId: this.config.networkId,
      keyStore: myKeyStore,
      nodeUrl: this.selectedRpcUrl,
      headers: { Referer: "https://beta.rpc.mainnet.near.org" },
      walletUrl: this.config.walletUrl,
      helperUrl: this.config.helperUrl,
      explorerUrl: this.config.explorerUrl,
    };
    this.nearConnection = await nearAPI.connect(connectionConfig);

    this.debugLog(
      `Switched to new RPC endpoint: ${this.selectedRpcUrl}`,
      "log",
    );
  }
}

const eventHelperInstance = EventJS.getInstance();

export default eventHelperInstance;
