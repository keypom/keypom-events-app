import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventCredentialsStore {
  secretKey: string;
  setEventCredentials: (secretKey: string) => void;
}

export const useEventCredentials = create<EventCredentialsStore>()(
  persist(
    (set) => ({
      secretKey: "",
      setEventCredentials: (secretKey) => set({ secretKey }),
    }),
    {
      name: "event-credentials", // Name of the item in localStorage
    },
  ),
);
