import { MULTICHAIN_NETWORKS } from "@/constants/common";

export const getChainNameFromId = (chainId: number): string => {
  const chain = MULTICHAIN_NETWORKS.find((chain) => chain.chainId === chainId);
  return chain ? chain.name : "Unknown";
};
