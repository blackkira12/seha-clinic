"use client";

import { useRole } from "./RoleContext";
import { users } from "@/data/users";
import { RoleId } from "@/data/types";

export default function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, user, setRole } = useRole();

  return (
    <div className={compact ? "" : "card"}>
      {!compact && <p className="label">Simulasi Peran (Role Switcher)</p>}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {user.initials}
        </div>
        <div className="min-w-0 flex-1">
          <select
            aria-label="Pilih peran"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleId)}
            className="input cursor-pointer"
          >
            {users.map((u) => (
              <option key={u.id} value={u.role}>
                {u.roleLabel} — {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
