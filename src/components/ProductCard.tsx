// Cartão de anúncio (catálogo / home). Sem compra — apenas "Visualizar".
import Link from "next/link";
import type { CatalogItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ item }: { item: CatalogItem }) {
  // Primeira letra do vendedor para o "avatar".
  const initial = (item.seller_username || "?").charAt(0).toUpperCase();

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:border-brand-blurple hover:shadow-glow">
      <Link href={`/produto/${item.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-dark-700">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-gray-600">
              sem imagem
            </div>
          )}
          {/* Selo de destaque, estilo "badge rara" */}
          <span className="absolute left-3 top-3 rounded-full bg-dark-900/85 px-3 py-1 text-xs font-semibold text-brand-blurple ring-1 ring-brand-blurple/40">
            ★ Badge
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/produto/${item.id}`}>
          <h3 className="line-clamp-1 font-semibold text-white transition group-hover:text-brand-blurple">
            {item.title}
          </h3>
        </Link>
        <p className="line-clamp-2 flex-1 text-sm text-gray-400">
          {item.description || "Sem descrição."}
        </p>

        {/* Vendedor com avatar */}
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
            {initial}
          </span>
          <span className="text-xs text-gray-500">@{item.seller_username}</span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-dark-600 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-600">
              Preço
            </p>
            <span className="text-lg font-bold text-white">
              {formatPrice(item.price)}
            </span>
          </div>
          <Link
            href={`/produto/${item.id}`}
            className="btn-primary px-4 py-2 text-sm"
          >
            Visualizar
          </Link>
        </div>
      </div>
    </div>
  );
}
