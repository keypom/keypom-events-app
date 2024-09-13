import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserData {
  name: string;
  email: string;
}

interface EventCredentialsStore {
  secretKey: string;
  userData: UserData;
  setEventCredentials: (secretKey: string, userData: UserData) => void;
}

export const useEventCredentials = create<EventCredentialsStore>()(
  persist(
    (set) => ({
      secretKey: "",
      userData: {
        name: "",
        email: "",
      },
      setEventCredentials: (secretKey, userData) =>
        set({ secretKey, userData }),
    }),
    {
      name: "event-credentials", // Name of the item in localStorage
    },
  ),
);
