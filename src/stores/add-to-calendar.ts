import { create } from "zustand";
import { AgendaEvent } from "@/lib/api/agendas";

interface AddToCalendarModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  event: AgendaEvent | null;
  setEvent: (event: AgendaEvent) => void;
}

export const useAddToCalendar = create<AddToCalendarModalStore>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
  event: null,
  setEvent: (event: AgendaEvent) => set(() => ({ event })),
}));
