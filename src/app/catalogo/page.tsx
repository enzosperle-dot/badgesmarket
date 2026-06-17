// CATÁLOGO ("/catalogo") — lista todos os anúncios ativos (view catalog).
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import type { CatalogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("catalog")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data as CatalogItem[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Catálogo</h1>
          <p className="mt-2 text-gray-400">
            {items.length} anúncio(s) disponível(is) para visualizar.
          </p>
        </div>
        <Link href="/anuncios/novo" className="btn-primary hidden sm:inline-flex">
          Criar anúncio
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          Nenhum anúncio ativo no momento.
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
