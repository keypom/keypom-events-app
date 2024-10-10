import { KEYPOM_CONTRACTS, NETWORK_ID } from "@/constants/common";

console.log(
  "Configured with NEAR Network and Contract ID: ",
  import.meta.env.VITE_NETWORK_ID,
  import.meta.env.VITE_CONTRACT_ID,
);

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
}

function getConfig(network = NETWORK_ID): NearConfig {
  const defaultConfig = {
    GAS: "200000000000000",
    gas: "200000000000000",
    attachedDeposit: "10000000000000000000000", // 0.01 N (1kb storage)
    NEW_ACCOUNT_AMOUNT: "1000000000000000000000000",
    NEW_CONTRACT_AMOUNT: "5000000000000000000000000",
  };

  switch (network) {
    case "testnet":
      return {
        ...defaultConfig,
        contractId: KEYPOM_CONTRACTS["testnet"].TOKEN_FACTORY_CONTRACT,
        networkId: "testnet",
        // nodeUrl: "https://test.api.fastnear.com",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };

    case "mainnet":
      return {
        ...defaultConfig,
        contractId: KEYPOM_CONTRACTS["mainnet"].TOKEN_FACTORY_CONTRACT,
        networkId: "mainnet",
        // nodeUrl: "https://api.fastnear.com",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://app.mynearwallet.com",
        helperUrl: "https://helper.near.org",
        explorerUrl: "https://explorer.near.org",
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Please configure in src/config/near.ts.`,
      );
  }
}

export default getConfig;
