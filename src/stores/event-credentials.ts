import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventCredentialsStore {
  eventId: string;
  secretKey: string;
  setEventCredentials: (eventId: string, secretKey: string) => void;
}

export const useEventCredentials = create<EventCredentialsStore>()(
  persist(
    (set) => ({
      eventId: "",
      secretKey: "",
      setEventCredentials: (eventId, secretKey) =>
        set({ eventId, secretKey }),
    }),
    {
      name: "event-credentials", // Name of the item in localStorage
    }
  )
);