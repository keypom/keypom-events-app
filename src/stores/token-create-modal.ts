/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface TokenCreateModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  handleClose: (
    dropCreated: any,
    isScavengerHunt: boolean,
    scavengerHunt: Array<{ piece: string; description: string }>,
    setIsModalLoading: (loading: boolean) => void,
  ) => Promise<void>;
  setHandleClose: (
    value: (
      dropCreated: any,
      isScavengerHunt: boolean,
      scavengerHunt: Array<{ piece: string; description: string }>,
      setIsModalLoading: (loading: boolean) => void,
    ) => Promise<void>,
  ) => void;

  tokenType: "token" | "nft";
  setTokenType: (value: "token" | "nft") => void;
}

export const useTokenCreateModalStore = create<TokenCreateModalStore>(
  (set) => ({
    isOpen: false,

    onOpen: () => set(() => ({ isOpen: true })),
    onClose: () => set(() => ({ isOpen: false })),

    tokenType: "token",
    setTokenType: (value: "token" | "nft") => set(() => ({ tokenType: value })),

    handleClose: async (
      _dropCreated: any,
      _isScavengerHunt: boolean,
      _scavengerHunt: Array<{ piece: string; description: string }>,
      _setIsModalLoading: (loading: boolean) => void,
    ) => {
      set(() => ({ isOpen: false }));
    },

    setHandleClose: (
      value: (
        dropCreated: any,
        isScavengerHunt: boolean,
        scavengerHunt: Array<{ piece: string; description: string }>,
        setIsModalLoading: (loading: boolean) => void,
      ) => Promise<void>,
    ) => set(() => ({ handleClose: value })),
  }),
);
