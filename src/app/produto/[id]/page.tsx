// PÁGINA DO ANÚNCIO ("/produto/[id]") — apenas visualização (sem compra).
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("catalog")
    .select("*")
    .eq("id", params.id)
    .single();

  const item = data as CatalogItem | null;
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex text-sm text-gray-400 transition hover:text-white"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-dark-600 bg-dark-700">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.title}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="grid aspect-square place-items-center text-gray-600">
              sem imagem
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple">
            @{item.seller_username}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-white">{item.title}</h1>

          <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-400">
            {item.description || "Sem descrição."}
          </p>

          <div className="mt-8 text-4xl font-extrabold text-white">
            {formatPrice(item.price)}
          </div>

          {/* Sem botão de compra — apenas informação de contato. */}
          <div className="mt-8 rounded-xl border border-dark-600 bg-dark-800 p-5 text-sm text-gray-400">
            Este anúncio é apenas para <strong>visualização</strong>. Entre em
            contato com <strong>@{item.seller_username}</strong> pelo Discord
            para negociar.
          </div>

          <p className="mt-4 text-xs text-gray-600">
            Publicado em{" "}
            {new Date(item.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
