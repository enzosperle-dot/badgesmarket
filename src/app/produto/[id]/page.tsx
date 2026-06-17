// PÁGINA DO PRODUTO (rota "/produto/[id]")
// Server Component: busca o produto no servidor e renderiza os detalhes.
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import BuyButton from "@/components/BuyButton";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  // Produto inexistente -> página 404.
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Voltar */}
      <Link
        href="/catalogo"
        className="mb-6 inline-flex text-sm text-gray-400 transition hover:text-white"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* IMAGEM */}
        <div className="overflow-hidden rounded-2xl border border-dark-600 bg-dark-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple">
            {product.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-white">{product.name}</h1>

          <p className="mt-4 leading-relaxed text-gray-400">
            {product.description}
          </p>

          <div className="mt-8 flex items-end gap-2">
            <span className="text-4xl font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
            <span className="mb-1 text-sm text-gray-500">pagamento único</span>
          </div>

          <div className="mt-8">
            {/* size="md" deixa o botão maior. Texto "Comprar agora" via label custom abaixo. */}
            <BuyButton product={product} />
          </div>

          {/* Lista de garantias / benefícios (apenas visual) */}
          <ul className="mt-8 space-y-2 text-sm text-gray-400">
            <li>✓ Download imediato após a compra</li>
            <li>✓ Acesso vitalício ao arquivo</li>
            <li>✓ Suporte para instalação</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
