import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserData {
  name: string;
  email: string;
}

interface EventCredentialsStore {
  secretKey: string;
  userData: UserData;
  isAdmin: boolean;
  setEventCredentials: (
    secretKey: string,
    userData: UserData,
    isAdmin: boolean,
  ) => void;
}

export const useEventCredentials = create<EventCredentialsStore>()(
  persist(
    (set) => ({
      secretKey: "",
      userData: {
        name: "",
        email: "",
      },
      isAdmin: false,
      setEventCredentials: (secretKey, userData, isAdmin) =>
        set({ secretKey, userData, isAdmin }),
    }),
    {
      name: "event-credentials", // Name of the item in localStorage
    },
  ),
);
