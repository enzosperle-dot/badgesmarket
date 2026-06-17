// Seção principal (Hero) — estilo marketplace de contas.
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-dark-600">
      {/* Brilhos decorativos */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-blurple/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-purple/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
        <span className="inline-block rounded-full border border-brand-blurple/40 bg-brand-blurple/10 px-4 py-1.5 text-sm font-medium text-brand-blurple">
          ✨ Contas com as badges mais raras
        </span>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Compre e venda contas de{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Discord
          </span>{" "}
          e mais
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Entrega rápida e suporte dedicado. Navegue pelo catálogo, encontre a
          conta com as badges que você quer e fale direto com o vendedor.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/catalogo"
            className="btn-primary px-8 py-3.5 text-base font-bold uppercase tracking-wide"
          >
            Ver catálogo
          </Link>
          <Link href="/anuncios/novo" className="btn-outline px-8 py-3.5 text-base">
            Quero vender
          </Link>
        </div>
      </div>
    </section>
  );
}
