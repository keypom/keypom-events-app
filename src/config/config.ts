const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_ID ?? "v2.keypom.testnet";

console.log(
  "Network and Contract IDs: ",
  import.meta.env.VITE_NETWORK_ID,
  import.meta.env.VITE_CONTRACT_ID,
);

export interface Config {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  contractName: string;
  explorerUrl: string;
  GAS: string;
  gas: string;
  attachedDeposit: string;
  NEW_ACCOUNT_AMOUNT: string;
  NEW_CONTRACT_AMOUNT: string;
  contractId: string;
}

function getConfig(
  network = import.meta.env.VITE_NETWORK_ID ?? "testnet",
): Config {
  const defaultConfig = {
    GAS: "200000000000000",
    gas: "200000000000000",
    attachedDeposit: "10000000000000000000000", // 0.01 N (1kb storage)
    NEW_ACCOUNT_AMOUNT: "1000000000000000000000000",
    NEW_CONTRACT_AMOUNT: "5000000000000000000000000",
    contractId: CONTRACT_NAME,
  };

  switch (network) {
    case "testnet":
      return {
        ...defaultConfig,
        contractName: CONTRACT_NAME,
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };

    case "mainnet":
      return {
        ...defaultConfig,
        contractName: CONTRACT_NAME,
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://app.mynearwallet.com",
        helperUrl: "https://helper.near.org",
        explorerUrl: "https://explorer.near.org",
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Can be configured in src/config.ts.`,
      );
  }
}

export default getConfig;
