import { Wallet } from "@near-wallet-selector/core";
import { create } from "zustand";

interface TokenDeleteModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  deletionArgs: {
    wallet: Wallet;
    dropId: string;
    getAccountInformation: () => Promise<void>;
  };
  setDeletionArgs: (args: TokenDeleteModalStore["deletionArgs"]) => void;
}

export const useTokenDeleteModalStore = create<TokenDeleteModalStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set(() => ({ isOpen: false })),
    onOpen: () => set(() => ({ isOpen: true })),
    deletionArgs: {
      wallet: {} as Wallet,
      dropId: "",
      getAccountInformation: () => Promise.resolve(),
    },
    setDeletionArgs: (args: TokenDeleteModalStore["deletionArgs"]) =>
      set(() => ({ deletionArgs: args })),
  }),
);
