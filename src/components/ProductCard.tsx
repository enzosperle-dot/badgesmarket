// Cartão de anúncio (catálogo / home). Sem compra — apenas "Visualizar".
import Link from "next/link";
import { type CatalogItem, accountTypeLabel } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ item }: { item: CatalogItem }) {
  // Nome e inicial do vendedor para o "avatar".
  const sellerName = item.seller_display_name || item.seller_username;
  const initial = (sellerName || "?").charAt(0).toUpperCase();

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
          {/* Selos: plataforma + tipo da conta */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-dark-900/85 px-2.5 py-1 text-xs font-semibold text-gray-200 ring-1 ring-dark-500">
              {item.platform}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                item.account_type === "og"
                  ? "bg-amber-500/15 text-amber-300 ring-amber-500/40"
                  : "bg-brand-blurple/15 text-brand-blurple ring-brand-blurple/40"
              }`}
            >
              {item.account_type === "og" ? "⭐ OG" : "🔁 Mudável"}
            </span>
          </div>
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

        {/* Vendedor: foto + nome + @user (vindos do banco) */}
        <div className="flex items-center gap-2">
          {item.seller_avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.seller_avatar}
              alt={sellerName}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-dark-500"
            />
          ) : (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
              {initial}
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-gray-300">
              {sellerName}
            </p>
            <p className="truncate text-[11px] text-gray-500">
              @{item.seller_username}
            </p>
          </div>
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
