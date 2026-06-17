// Seção principal (Hero) — estilo marketplace de contas.
import Link from "next/link";

// Plataformas exibidas em destaque (igual a sites de marketplace de contas).
// EDITAR AQUI para adicionar/remover plataformas.
const PLATFORMS = [
  "Discord",
  "Instagram",
  "TikTok",
  "Twitter / X",
  "Roblox",
  "Steam",
  "Epic Games",
  "Free Fire",
  "Valorant",
];

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

        {/* Fileira de plataformas */}
        <div className="mt-14">
          <p className="text-xs uppercase tracking-widest text-gray-600">
            Suas contas favoritas
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {PLATFORMS.map((p) => (
              <span
                key={p}
                className="rounded-full border border-dark-600 bg-dark-800 px-4 py-1.5 text-sm font-medium text-gray-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
