// near.ts

import { KEYPOM_CONTRACTS, NETWORK_ID } from "@/constants/common";

export interface RpcEndpoint {
  url: string;
  simpleName: string;
}

export interface NearConfig {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
  GAS: string;
  gas: string;
  attachedDeposit: string;
  NEW_ACCOUNT_AMOUNT: string;
  NEW_CONTRACT_AMOUNT: string;
  contractId: string;
  rpcList: { [key: string]: RpcEndpoint };
}

function getConfig(network = NETWORK_ID): NearConfig {
  const defaultConfig = {
    GAS: "200000000000000",
    gas: "200000000000000",
    attachedDeposit: "10000000000000000000000", // 0.01 N (1kb storage)
    NEW_ACCOUNT_AMOUNT: "1000000000000000000000000",
    NEW_CONTRACT_AMOUNT: "5000000000000000000000000",
    rpcList: {},
  };

  console.log("network", network);
  switch (network) {
    case "testnet":
      return {
        ...defaultConfig,
        contractId: KEYPOM_CONTRACTS["testnet"].TOKEN_FACTORY_CONTRACT,
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        rpcList: {
          defaultRpc: {
            url: "https://rpc.testnet.near.org",
            simpleName: "official rpc",
          },
          lavaRpc: {
            url: "https://g.w.lavanet.xyz:443/gateway/neart/rpc-http/f653c33afd2ea30614f69bc1c73d4940",
            simpleName: "lava rpc",
          },
        },
      };

    case "mainnet":
      return {
        ...defaultConfig,
        contractId: KEYPOM_CONTRACTS["mainnet"].TOKEN_FACTORY_CONTRACT,
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://app.mynearwallet.com",
        helperUrl: "https://helper.near.org",
        explorerUrl: "https://explorer.near.org",
        rpcList: {
          lavaRpc: {
            url: "https://g.w.lavanet.xyz:443/gateway/near/rpc-http/f653c33afd2ea30614f69bc1c73d4940",
            simpleName: "lava rpc",
          },
          fastnearRpc: {
            url: "https://free.rpc.fastnear.com",
            simpleName: "fastnear rpc",
          },
        },
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Please configure in src/config/near.ts.`,
      );
  }
}

export default getConfig;
