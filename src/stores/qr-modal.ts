/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

interface QRModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  qrCodeUrls: string[]; // Array of QR code URLs
  qrCodeDescriptions: string[]; // Array of descriptions
  dropName: string; // Add dropName to the store
  onDownload: (url: string, filename: string) => void;
  onDownloadAll: (urls: string[], filenames: string[]) => void;
  setOnDownload: (value: (url: string, filename: string) => void) => void;
  setOnDownloadAll: (
    value: (urls: string[], filenames: string[]) => void,
  ) => void;
  setQrCodeUrls: (value: string[]) => void;
  setQrCodeDescriptions: (value: string[]) => void;
  setDropName: (value: string) => void; // Add setter for dropName
}

export const useQRModalStore = create<QRModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
  qrCodeUrls: [],
  qrCodeDescriptions: [],
  dropName: "",
  onDownload: (_url: string, _filename: string) => void 0,
  onDownloadAll: (_urls: string[], _filenames: string[]) => void 0,
  setOnDownload: (value: (url: string, filename: string) => void) =>
    set(() => ({ onDownload: value })),
  setOnDownloadAll: (value: (urls: string[], filenames: string[]) => void) =>
    set(() => ({ onDownloadAll: value })),
  setQrCodeUrls: (value: string[]) => set(() => ({ qrCodeUrls: value })),
  setQrCodeDescriptions: (value: string[]) =>
    set(() => ({ qrCodeDescriptions: value })),
  setDropName: (value: string) => set(() => ({ dropName: value })),
}));
