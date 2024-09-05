import { create } from "zustand";

interface TokenCreateModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onCreate: () => Promise<void>;
  dropProps: {
    name: string;
    artwork: undefined;
    amount: string;
    nftData: undefined;
  };
  scavengerPieces: [
    {
      piece: string;
      description: string;
    },
    {
      piece: string;
      description: string;
    },
  ];
  isLoading: boolean;
  isScavengerHunt: boolean;
}

export const useTokenCreateModalStore = create<TokenCreateModalStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set(() => ({ isOpen: false })),
    onOpen: () => set(() => ({ isOpen: true })),
    onCreate: async () => {
      set(() => ({ isOpen: false }));
    },
    dropProps: {
      name: "",
      artwork: undefined,
      amount: "1",
      nftData: undefined,
    },
    scavengerPieces: [
      {
        piece: `Piece 1`,
        description: "",
      },
      {
        piece: `Piece 2`,
        description: "",
      },
    ],
    isLoading: false,
    isScavengerHunt: false,
  }),
);
