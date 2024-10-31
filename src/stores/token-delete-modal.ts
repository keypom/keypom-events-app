import { DropData } from "@/lib/event";
import { create } from "zustand";

interface TokenDeleteModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  deletionArgs: {
    secretKey: string;
    dropId: string;
    getAccountInformation: () => Promise<DropData[] | undefined>;
  };
  setDeletionArgs: (args: TokenDeleteModalStore["deletionArgs"]) => void;
}

export const useTokenDeleteModalStore = create<TokenDeleteModalStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set(() => ({ isOpen: false })),
    onOpen: () => set(() => ({ isOpen: true })),
    deletionArgs: {
      secretKey: "",
      dropId: "",
      getAccountInformation: () => Promise.resolve(undefined),
    },
    setDeletionArgs: (args: TokenDeleteModalStore["deletionArgs"]) =>
      set(() => ({ deletionArgs: args })),
  }),
);
