// PÁGINA DO ANÚNCIO ("/produto/[id]") — apenas visualização (sem compra).
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { type CatalogItem, accountTypeLabel } from "@/lib/types";

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

  // Nome de exibição do vendedor (cai para o username se não tiver).
  const sellerName = item.seller_display_name || item.seller_username;

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
          {/* Selos: plataforma + tipo */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-dark-700 px-3 py-1 text-sm font-medium text-gray-200">
              {item.platform}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                item.account_type === "og"
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-brand-blurple/15 text-brand-blurple"
              }`}
            >
              {accountTypeLabel(item.account_type)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white">{item.title}</h1>

          <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-400">
            {item.description || "Sem descrição."}
          </p>

          <div className="mt-8 text-4xl font-extrabold text-white">
            {formatPrice(item.price)}
          </div>

          {/* Vendedor + contato do Discord */}
          <div className="mt-8 rounded-xl border border-dark-600 bg-dark-800 p-5">
            <div className="flex items-center gap-3">
              {item.seller_avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.seller_avatar}
                  alt={sellerName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-lg font-bold text-white">
                  {sellerName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-semibold text-white">{sellerName}</p>
                {item.seller_discord ? (
                  <p className="text-sm text-brand-blurple">
                    Discord: @{item.seller_discord}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Vendedor sem contato cadastrado
                  </p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Este anúncio é apenas para <strong>visualização</strong>. Chame o
              vendedor pelo Discord acima para negociar.
            </p>
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
