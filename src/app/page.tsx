// PÁGINA HOME (rota "/")
// Server Component: lê os produtos direto do "banco" JSON no servidor.
import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";

export default async function HomePage() {
  const products = await getProducts();
  // Mostra apenas produtos ativos e pega os 3 primeiros como destaque.
  const destaques = products.filter((p) => p.active).slice(0, 3);

  return (
    <>
      <Hero />

      {/* DESTAQUES DOS PRODUTOS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Destaques</h2>
            <p className="mt-2 text-gray-400">
              Os produtos mais procurados da loja.
            </p>
          </div>
          <Link href="/catalogo" className="btn-outline hidden sm:inline-flex">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/catalogo" className="btn-primary">
            Ver produtos
          </Link>
        </div>
      </section>

      {/* FAIXA DE CATEGORIAS / CHAMADA */}
      <section className="border-t border-dark-600 bg-dark-800/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-16 sm:grid-cols-4">
          {[
            { titulo: "Templates", desc: "Servidores prontos" },
            { titulo: "Bots", desc: "Automatize tudo" },
            { titulo: "Cargos & Artes", desc: "Visual impecável" },
            { titulo: "Serviços", desc: "Configuramos para você" },
          ].map((item) => (
            <div key={item.titulo} className="card p-6 text-center">
              <h3 className="font-semibold text-white">{item.titulo}</h3>
              <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
