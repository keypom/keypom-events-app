import { create } from "zustand";

interface TokenDeleteModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  deletionArgs: {
    secretKey: string;
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
      secretKey: "",
      dropId: "",
      getAccountInformation: () => Promise.resolve(),
    },
    setDeletionArgs: (args: TokenDeleteModalStore["deletionArgs"]) =>
      set(() => ({ deletionArgs: args })),
  }),
);
