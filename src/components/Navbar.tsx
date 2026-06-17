"use client";

// Barra de navegação. Mostra links conforme o login e o cargo do usuário.
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { canManageAll } from "@/lib/types";

export default function Navbar() {
  const { profile, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-dark-600 bg-dark-900/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient font-black text-white">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">
            Badges<span className="text-brand-purple">Market</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden items-center gap-6 text-sm font-medium text-gray-300 md:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/catalogo" className="transition hover:text-white">
            Catálogo
          </Link>
          {profile && (
            <Link href="/dashboard" className="transition hover:text-white">
              Meus anúncios
            </Link>
          )}
          {canManageAll(profile?.role) && (
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          )}
        </div>

        {/* Autenticação */}
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="h-8 w-20 animate-pulse rounded-lg bg-dark-600" />
          ) : profile ? (
            <>
              <span className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
                @{profile.username}
                <span className="rounded-full bg-brand-purple/15 px-2 py-0.5 text-xs text-brand-purple">
                  {profile.role}
                </span>
              </span>
              <button onClick={signOut} className="btn-outline px-4 py-2 text-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline px-4 py-2 text-sm">
                Entrar
              </Link>
              <Link href="/registrar" className="btn-primary px-4 py-2 text-sm">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
