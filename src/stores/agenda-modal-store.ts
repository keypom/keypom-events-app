import { create } from "zustand";

type Agenda = {
  date: string;
  timeFrom: string;
  timeTo: string;
  events: {
    title: string;
    stage: string;
    description: string;
    presenter: string;
  };
};

interface AgendaModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  agenda: Agenda | null;
  setAgenda: (agenda: Agenda) => void;
}

export const useAgendaModalStore = create<AgendaModalStore>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
  agenda: null,
  setAgenda: (agenda: Agenda) => set(() => ({ agenda })),
}));
