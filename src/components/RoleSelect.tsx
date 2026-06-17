"use client";

// Seletor de cargo (somente o owner consegue alterar — validado pela RPC
// set_user_role no banco). Para os demais, fica desabilitado.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ROLES, type UserRole } from "@/lib/types";

export default function RoleSelect({
  userId,
  currentRole,
  canEdit,
}: {
  userId: string;
  currentRole: UserRole;
  canEdit: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(currentRole);
  const [saving, setSaving] = useState(false);

  async function handleChange(newRole: UserRole) {
    const prev = role;
    setRole(newRole);
    setSaving(true);
    const { error } = await supabase.rpc("set_user_role", {
      target: userId,
      new_role: newRole,
    });
    setSaving(false);
    if (error) {
      alert("Erro ao alterar cargo: " + error.message);
      setRole(prev); // desfaz visualmente
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={role}
      disabled={!canEdit || saving}
      onChange={(e) => handleChange(e.target.value as UserRole)}
      className="rounded-md border border-dark-500 bg-dark-700 px-2 py-1 text-sm text-gray-100 disabled:opacity-60"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
