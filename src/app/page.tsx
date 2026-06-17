// HOME ("/") — Server Component. Busca anúncios ativos no Supabase (view catalog).
import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import type { CatalogItem } from "@/lib/types";

// Renderiza sob demanda (não no build) porque depende de dados/sessão.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("catalog")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const destaques = (data as CatalogItem[]) ?? [];

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Anúncios recentes</h2>
            <p className="mt-2 text-gray-400">As contas adicionadas por último.</p>
          </div>
          <Link href="/catalogo" className="btn-outline hidden sm:inline-flex">
            Ver todos
          </Link>
        </div>

        {destaques.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            Ainda não há anúncios. Seja o primeiro a{" "}
            <Link href="/anuncios/novo" className="text-brand-purple hover:underline">
              criar um anúncio
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
