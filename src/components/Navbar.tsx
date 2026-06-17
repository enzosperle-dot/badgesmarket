"use client";

// Barra de navegação. No celular mostra um menu "hambúrguer" (3 tracinhos).
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { canManageAll } from "@/lib/types";

export default function Navbar() {
  const { profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false); // menu mobile aberto?
  const pathname = usePathname();

  // Fecha o menu ao trocar de página ou clicar num link.
  const close = () => setOpen(false);

  // Links de navegação (reaproveitados no desktop e no mobile).
  const links = [
    { href: "/", label: "Home" },
    { href: "/catalogo", label: "Catálogo" },
    ...(profile ? [{ href: "/dashboard", label: "Meus anúncios" }] : []),
    ...(profile ? [{ href: "/perfil", label: "Perfil" }] : []),
    ...(canManageAll(profile?.role)
      ? [
          { href: "/admin", label: "Admin" },
          { href: "/admin/logs", label: "Logs" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-dark-600 bg-dark-900/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient font-black text-white">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">
            Badges<span className="text-brand-purple">Market</span>
          </span>
        </Link>

        {/* Links (desktop) */}
        <div className="hidden items-center gap-6 text-sm font-medium text-gray-300 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Autenticação (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
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

        {/* Botão hambúrguer (mobile) */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg border border-dark-600 text-gray-200 transition hover:border-brand-purple md:hidden"
        >
          {open ? (
            // Ícone "X"
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            // Ícone 3 tracinhos
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Painel do menu (mobile) */}
      {open && (
        <div className="border-t border-dark-600 bg-dark-900 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            {/* Links */}
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className={`rounded-lg px-3 py-3 text-base font-medium transition hover:bg-dark-700 ${
                    pathname === l.href ? "text-brand-purple" : "text-gray-200"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Autenticação */}
            <div className="mt-4 border-t border-dark-600 pt-4">
              {loading ? null : profile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    @{profile.username} · {profile.role}
                  </span>
                  <button
                    onClick={() => {
                      signOut();
                      close();
                    }}
                    className="btn-outline px-4 py-2 text-sm"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={close}
                    className="btn-outline flex-1 justify-center px-4 py-2.5 text-sm"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/registrar"
                    onClick={close}
                    className="btn-primary flex-1 justify-center px-4 py-2.5 text-sm"
                  >
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
