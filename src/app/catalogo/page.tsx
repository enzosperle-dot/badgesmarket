// CATÁLOGO ("/catalogo") — lista anúncios ativos (view catalog).
// Aceita ?plataforma=Discord para filtrar (vindo dos ícones da home).
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { PLATFORMS, type CatalogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { plataforma?: string };
}) {
  const plataforma = searchParams.plataforma;
  const supabase = createClient();

  let query = supabase
    .from("catalog")
    .select("*")
    .order("created_at", { ascending: false });

  // Filtro por plataforma, se informado.
  if (plataforma) query = query.eq("platform", plataforma);

  const { data } = await query;
  const items = (data as CatalogItem[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {plataforma ? `Contas de ${plataforma}` : "Catálogo"}
          </h1>
          <p className="mt-2 text-gray-400">
            {items.length} anúncio(s) disponível(is) para visualizar.
          </p>
        </div>
        <Link href="/anuncios/novo" className="btn-primary hidden sm:inline-flex">
          Criar anúncio
        </Link>
      </header>

      {/* Filtros de plataforma */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/catalogo"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !plataforma
              ? "bg-brand-gradient text-white shadow-glow"
              : "border border-dark-600 bg-dark-800 text-gray-300 hover:border-brand-blurple"
          }`}
        >
          Todas
        </Link>
        {PLATFORMS.map((p) => (
          <Link
            key={p}
            href={`/catalogo?plataforma=${encodeURIComponent(p)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              plataforma === p
                ? "bg-brand-gradient text-white shadow-glow"
                : "border border-dark-600 bg-dark-800 text-gray-300 hover:border-brand-blurple"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          Nenhum anúncio nesta categoria ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
