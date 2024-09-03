import { EventDrop } from "@/lib/eventsHelper";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TicketStore {
  ticketData: EventDrop | null;
  setTicketData: (data: EventDrop) => void;
  clearTicketData: () => void;
}

export const useTicketStore = create<TicketStore>(
  persist(
    (set) => ({
      setTicketData: (data: EventDrop) => set({ ticketData: data }),
      clearTicketData: () => set({ ticketData: null }),
    }),
    {
      name: "ticket-storage",
    },
  ),
);
