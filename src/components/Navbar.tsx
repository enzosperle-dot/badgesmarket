"use client";

// Barra de navegação fixa no topo. Mostra links e estado de login.
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-dark-600 bg-dark-900/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / nome do site */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient font-black text-white">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">
            Badges<span className="text-brand-purple">Market</span>
          </span>
        </Link>

        {/* Links principais */}
        <div className="hidden items-center gap-6 text-sm font-medium text-gray-300 md:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/catalogo" className="transition hover:text-white">
            Catálogo
          </Link>
          {user && (
            <Link href="/dashboard" className="transition hover:text-white">
              Minha conta
            </Link>
          )}
          {/* O link de Admin aparece apenas para usuários com role "admin". */}
          {user?.role === "admin" && (
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          )}
        </div>

        {/* Área de autenticação */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-gray-400 sm:inline">
                Olá, {user.name.split(" ")[0]}
              </span>
              <button onClick={logout} className="btn-outline px-4 py-2 text-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline px-4 py-2 text-sm">
                Entrar
              </Link>
              <Link
                href="/registrar"
                className="btn-primary px-4 py-2 text-sm"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
