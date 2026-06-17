// HOME ("/") — Server Component. Estilo marketplace de contas (tipo insignias).
import Link from "next/link";
import Hero from "@/components/Hero";
import PlatformGrid from "@/components/PlatformGrid";
import OwnersSection from "@/components/OwnersSection";
import ProductCard from "@/components/ProductCard";
import Faq from "@/components/Faq";
import { createClient } from "@/lib/supabase/server";
import type { CatalogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

// Passos do "Como funciona". EDITAR AQUI os textos.
const STEPS = [
  {
    n: "01",
    title: "Escolha",
    desc: "Navegue pelo catálogo e encontre a conta com as badges que você quer.",
  },
  {
    n: "02",
    title: "Combine com segurança",
    desc: "Veja os detalhes do anúncio e fale direto com o vendedor pelo Discord.",
  },
  {
    n: "03",
    title: "Receba a conta",
    desc: "Acerte o pagamento, receba os dados de acesso e troque o e-mail: a conta é sua.",
  },
];

// Destaques de confiança.
const FEATURES = [
  { icon: "⚡", title: "Entrega rápida", desc: "Combine e receba na hora." },
  { icon: "🔒", title: "Negociação direta", desc: "Fale com o vendedor." },
  { icon: "🏅", title: "Badges raras", desc: "Contas selecionadas." },
  { icon: "💬", title: "Suporte", desc: "Tire dúvidas a qualquer hora." },
];

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("catalog")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  const destaques = (data as CatalogItem[]) ?? [];

  return (
    <>
      <Hero />

      {/* GRADE DE PLATAFORMAS CLICÁVEIS */}
      <PlatformGrid />

      {/* CONTAS EM DESTAQUE */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-blurple">
              Contas em destaque
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              As mais recentes
            </h2>
          </div>
          <Link href="/catalogo" className="btn-outline hidden sm:inline-flex">
            Ver todas
          </Link>
        </div>

        {destaques.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            Ainda não há contas anunciadas. Seja o primeiro a{" "}
            <Link href="/anuncios/novo" className="text-brand-blurple hover:underline">
              criar um anúncio
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destaques.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/catalogo" className="btn-primary">
            Ver todas as contas
          </Link>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-dark-600 bg-dark-800/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest text-brand-blurple">
              Como funciona
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Simples e rápido
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="card relative p-7">
                <span className="text-4xl font-black text-brand-blurple/30">
                  {step.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Destaques de confiança */}
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-dark-600 bg-dark-800 p-5 text-center"
              >
                <div className="text-2xl">{f.icon}</div>
                <h4 className="mt-2 font-semibold text-white">{f.title}</h4>
                <p className="mt-1 text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONOS / FUNDADORES */}
      <OwnersSection />

      {/* FAQ */}
      <Faq />

      {/* CHAMADA FINAL */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="card relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-blurple/20 blur-3xl" />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
            Tem uma conta com badges raras?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-gray-400">
            Anuncie agora no Badges Market e alcance compradores interessados.
          </p>
          <div className="relative mt-6">
            <Link href="/anuncios/novo" className="btn-primary px-8 py-3.5">
              Criar meu anúncio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
