"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { RoleId, StaffUser } from "@/data/types";
import { users, getUserByRole } from "@/data/users";

interface RoleContextValue {
  role: RoleId;
  user: StaffUser;
  setRole: (role: RoleId) => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = "seha-role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>("admin");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (stored && users.some((u) => u.role === stored)) {
      setRoleState(stored);
    }
  }, []);

  const setRole = (next: RoleId) => {
    setRoleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const user = getUserByRole(role) ?? users[0];

  return (
    <RoleContext.Provider value={{ role, user, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
