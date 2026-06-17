"use client";

// =====================================================================
// CONTEXTO DE AUTENTICAÇÃO (SIMULADO NO MVP)
//
// A sessão é guardada no localStorage do navegador. Não há cookies/JWT.
// É suficiente para um MVP/demonstração.
//
// FUTURO: substituir por NextAuth.js, Clerk, Supabase Auth, etc.
// Mantendo este hook `useAuth()`, o resto do app continua funcionando.
// =====================================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { SafeUser } from "./types";

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = "badges_user"; // chave usada no localStorage

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao montar, recupera a sessão salva no navegador.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignora erros de parse
    }
    setLoading(false);
  }, []);

  // Salva (ou limpa) o usuário no localStorage.
  function persist(u: SafeUser | null) {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Erro ao entrar" };
    persist(data.user);
    return { ok: true };
  }

  async function register(name: string, email: string, password: string) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Erro ao criar conta" };
    persist(data.user);
    return { ok: true };
  }

  function logout() {
    persist(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acessar a autenticação em qualquer componente cliente.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
