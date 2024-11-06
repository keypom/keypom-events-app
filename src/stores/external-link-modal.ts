import { create } from "zustand";

interface externalLinkModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  link: string | null;
  setLink: (link: string) => void;
}

export const useExternalLinkModalStore = create<externalLinkModalStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set(() => ({ isOpen: false })),
    onOpen: () => set(() => ({ isOpen: true })),
    link: null,
    setLink: (link: string) => set(() => ({ link })),
  }),
);
