// Seção principal (Hero) da Home.
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
        <span className="inline-block rounded-full border border-brand-purple/40 bg-brand-purple/10 px-4 py-1.5 text-sm font-medium text-brand-purple">
          🎮 Marketplace de contas de Discord
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Anuncie e descubra{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            contas de Discord
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Crie seu anúncio em segundos com imagem, título, descrição e valor.
          Explore o catálogo e clique em <strong>Visualizar</strong> para ver os
          detalhes de cada conta.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/catalogo" className="btn-primary px-8 py-3.5 text-lg">
            Ver anúncios
          </Link>
          <Link href="/anuncios/novo" className="btn-outline px-8 py-3.5 text-lg">
            Criar anúncio
          </Link>
        </div>
      </div>
    </section>
  );
}
