"use client";

// Cartão de produto usado na Home e no Catálogo.
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import BuyButton from "./BuyButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card group overflow-hidden transition hover:border-brand-purple hover:shadow-glow">
      {/* Imagem do produto (link para a página de detalhe) */}
      <Link href={`/produto/${product.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-dark-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-dark-900/80 px-3 py-1 text-xs font-medium text-brand-purple">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="flex flex-col gap-3 p-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="line-clamp-1 font-semibold text-white transition hover:text-brand-purple">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-gray-400">
          {product.description}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {formatPrice(product.price)}
          </span>
          {/* Botão de compra (cria um pedido) */}
          <BuyButton product={product} size="sm" />
        </div>
      </div>
    </div>
  );
}
