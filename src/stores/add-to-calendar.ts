import { create } from "zustand";
import { AgendaItem } from "@/lib/api/agendas";

interface AddToCalendarModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  event: AgendaItem | null;
  setEvent: (event: AgendaItem) => void;
}

export const useAddToCalendar = create<AddToCalendarModalStore>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
  event: null,
  setEvent: (event: AgendaItem) => set(() => ({ event })),
}));
