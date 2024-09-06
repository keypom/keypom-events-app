/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

interface QRModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  qrCodeUrls: string[]; // Array of QR code URLs
  onDownload: (url: string) => void;
  onDownloadAll: (urls: string[]) => void;
  setOnDownload: (value: (url: string) => void) => void;
  setOnDownloadAll: (value: (urls: string[]) => void) => void;
  setQrCodeUrls: (value: string[]) => void;
}

export const useQRModalStore = create<QRModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
  qrCodeUrls: [],
  onDownload: (_url: string) => void 0,
  onDownloadAll: (_urls: string[]) => void 0,
  setOnDownload: (value: (url: string) => void) =>
    set(() => ({ onDownload: value })),
  setOnDownloadAll: (value: (urls: string[]) => void) =>
    set(() => ({ onDownloadAll: value })),
  setQrCodeUrls: (value: string[]) => set(() => ({ qrCodeUrls: value })),
}));
