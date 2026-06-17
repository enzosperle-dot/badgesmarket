// Rodapé.
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-dark-600 bg-dark-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Marca */}
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient font-black text-white">
              B
            </span>
            <span className="font-bold tracking-tight text-white">
              Badges<span className="text-brand-purple">Market</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400">
            <Link href="/catalogo" className="transition hover:text-white">
              Catálogo
            </Link>
            <Link href="/anuncios/novo" className="transition hover:text-white">
              Anunciar
            </Link>
            <Link href="/login" className="transition hover:text-white">
              Entrar
            </Link>
            <Link href="/registrar" className="transition hover:text-white">
              Criar conta
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-dark-600 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Badges Market. Este site não é afiliado a
          nenhuma das plataformas anunciadas.
        </div>
      </div>
    </footer>
  );
}
