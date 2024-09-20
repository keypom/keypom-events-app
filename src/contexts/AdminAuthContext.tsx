// src/contexts/AdminAuthContext.js

import React, { createContext, useContext, useState } from "react";

// Define the type for adminUser
export interface AdminUser {
  idToken: string;
}

export interface AdminProfile {
  email: string;
  name: string;
  picture: string;
}

// Define the context type
interface AdminAuthContextType {
  adminUser: AdminUser | null;
  setAdminUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const value = { adminUser, setAdminUser };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);

  if (context === null || context === undefined) {
    throw new Error(
      "useAdminAuthContext must be used within a AdminAuthProvider",
    );
  }

  return context;
};
