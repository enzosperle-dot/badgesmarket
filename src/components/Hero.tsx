// Seção principal (Hero) da Home.
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Brilhos decorativos de fundo */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
        <span className="inline-block rounded-full border border-brand-purple/40 bg-brand-purple/10 px-4 py-1.5 text-sm font-medium text-brand-purple">
          🚀 Tudo para o seu servidor de Discord
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Produtos digitais que deixam seu{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Discord profissional
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Templates de servidores, bots personalizados, packs de cargos, artes e
          serviços de configuração. Tudo em um só lugar, pronto para usar.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/catalogo" className="btn-primary px-8 py-3.5 text-lg">
            Ver produtos
          </Link>
          <Link href="/registrar" className="btn-outline px-8 py-3.5 text-lg">
            Criar conta grátis
          </Link>
        </div>
      </div>
    </section>
  );
}
