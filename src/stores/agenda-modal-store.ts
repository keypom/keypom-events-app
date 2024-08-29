import { create } from "zustand";
import { AgendaEvent } from "@/lib/api/agendas";

interface AgendaModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  agenda: AgendaEvent | null;
  setAgenda: (agenda: AgendaEvent) => void;
}

export const useAgendaModalStore = create<AgendaModalStore>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
  agenda: null,
  setAgenda: (agenda: AgendaEvent) => set(() => ({ agenda })),
}));
