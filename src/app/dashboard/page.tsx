"use client";

// DASHBOARD DO USUÁRIO (rota "/dashboard")
// Mostra dados da conta, compras realizadas e links de download.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import type { Order, Product } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Protege a rota: se não estiver logado, manda para o login.
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Carrega os pedidos do usuário e a lista de produtos (para pegar downloadUrl).
  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/orders?userId=${user.id}`).then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) {
    return <p className="py-20 text-center text-gray-400">Carregando...</p>;
  }

  // Helper: encontra o produto de um pedido para pegar o link de download.
  const findProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Minha conta</h1>

      {/* DADOS DA CONTA */}
      <section className="mt-6 card p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Dados da conta</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Info label="Nome" value={user.name} />
          <Info label="Email" value={user.email} />
          <Info label="Tipo de conta" value={user.role === "admin" ? "Administrador" : "Cliente"} />
        </div>
      </section>

      {/* COMPRAS E DOWNLOADS */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Compras realizadas
        </h2>

        {loading ? (
          <p className="text-gray-400">Carregando compras...</p>
        ) : orders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400">Você ainda não comprou nada.</p>
            <Link href="/catalogo" className="btn-primary mt-4">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const product = findProduct(order.productId);
              return (
                <div
                  key={order.id}
                  className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {order.productName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatPrice(order.price)} •{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")} •{" "}
                      <span className="text-green-400">{order.status}</span>
                    </p>
                  </div>

                  {/* Botão de download (disponível porque a compra está paga) */}
                  {product?.downloadUrl ? (
                    <a
                      href={product.downloadUrl}
                      className="btn-primary px-5 py-2.5 text-sm"
                      download
                    >
                      Baixar
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Download indisponível
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// Pequeno componente auxiliar para exibir um par rótulo/valor.
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-dark-600 bg-dark-700/50 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}
