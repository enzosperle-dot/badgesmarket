// Rodapé simples do site.
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-dark-600 bg-dark-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-400 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Badges Market. Produtos digitais para
          Discord.
        </p>
        <div className="flex gap-5">
          <Link href="/catalogo" className="transition hover:text-white">
            Catálogo
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Entrar
          </Link>
          <Link href="/registrar" className="transition hover:text-white">
            Criar conta
          </Link>
        </div>
      </div>
    </footer>
  );
}
