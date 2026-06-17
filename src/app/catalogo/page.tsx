"use client";

// PÁGINA CATÁLOGO (rota "/catalogo")
// Carrega os produtos via API e permite filtrar por categoria.
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, type Product } from "@/lib/types";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // "Todos" = sem filtro de categoria.
  const [category, setCategory] = useState<string>("Todos");

  // Busca os produtos ao abrir a página.
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  // Aplica os filtros: somente ativos + categoria escolhida.
  const filtered = useMemo(() => {
    return products
      .filter((p) => p.active)
      .filter((p) => category === "Todos" || p.category === category);
  }, [products, category]);

  // Lista de botões de filtro: "Todos" + categorias.
  const filterOptions = ["Todos", ...CATEGORIES];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Catálogo</h1>
        <p className="mt-2 text-gray-400">
          Escolha entre templates, bots, cargos, artes e serviços.
        </p>
      </header>

      {/* FILTRO POR CATEGORIA */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setCategory(opt)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === opt
                ? "bg-brand-gradient text-white shadow-glow"
                : "border border-dark-600 bg-dark-800 text-gray-300 hover:border-brand-purple"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* LISTA DE PRODUTOS */}
      {loading ? (
        <p className="py-20 text-center text-gray-400">Carregando produtos...</p>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-gray-400">
          Nenhum produto nesta categoria.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
