// Cartão de anúncio (catálogo / home). Sem compra — apenas "Visualizar".
import Link from "next/link";
import type { CatalogItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <div className="card group flex flex-col overflow-hidden transition hover:border-brand-purple hover:shadow-glow">
      <Link href={`/produto/${item.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-dark-700">
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
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/produto/${item.id}`}>
          <h3 className="line-clamp-1 font-semibold text-white transition hover:text-brand-purple">
            {item.title}
          </h3>
        </Link>
        <p className="line-clamp-2 flex-1 text-sm text-gray-400">
          {item.description || "Sem descrição."}
        </p>

        <div className="text-xs text-gray-500">por @{item.seller_username}</div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {formatPrice(item.price)}
          </span>
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
