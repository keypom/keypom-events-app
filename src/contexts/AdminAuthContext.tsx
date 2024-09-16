// src/contexts/AdminAuthContext.js

import React, { createContext, useState } from "react";

// Define the type for adminUser
interface AdminUser {
  id: string;
  email: string;
  name: string;
  // Add other properties as needed
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
