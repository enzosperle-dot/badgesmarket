"use client";

// =====================================================================
// CONTEXTO DE AUTENTICAÇÃO (Supabase Auth)
//
// Disponibiliza o usuário logado + seu perfil (com o cargo) em qualquer
// componente cliente, além de logout. A sessão é mantida via cookies
// pelo @supabase/ssr (com ajuda do middleware).
// =====================================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

interface AuthContextType {
  profile: Profile | null; // perfil (username, cargo...) ou null se deslogado
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca o perfil do usuário logado na tabela profiles.
  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();

    // Recarrega o perfil quando o estado de login muda (login/logout).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => subscription.unsubscribe();
  }, [loadProfile, supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/");
    router.refresh();
  }

  return (
    <AuthContext.Provider
      value={{ profile, loading, signOut, refresh: loadProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
