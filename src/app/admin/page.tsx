"use client";

// =====================================================================
// PAINEL ADMIN (rota "/admin")
// Permite criar, editar e remover produtos, além de ver os pedidos.
// Acesso restrito a usuários com role "admin".
// =====================================================================

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { CATEGORIES, type Product, type Order } from "@/lib/types";

// Estado inicial do formulário de produto (vazio = criar novo).
const emptyForm = {
  id: "",
  name: "",
  description: "",
  price: "",
  category: CATEGORIES[0] as string,
  image: "",
  downloadUrl: "",
  active: true,
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const isEditing = form.id !== "";

  // Carrega produtos e pedidos.
  const loadData = useCallback(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/orders").then((r) => r.json()).then(setOrders);
  }, []);

  // Protege a rota: precisa estar logado e ser admin.
  useEffect(() => {
    if (authLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "admin") router.push("/dashboard");
    else loadData();
  }, [authLoading, user, router, loadData]);

  if (authLoading || !user || user.role !== "admin") {
    return <p className="py-20 text-center text-gray-400">Carregando...</p>;
  }

  // Atualiza um campo do formulário.
  function setField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Preenche o formulário para edição.
  function startEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      image: p.image,
      downloadUrl: p.downloadUrl,
      active: p.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Limpa o formulário (volta ao modo "criar").
  function resetForm() {
    setForm(emptyForm);
  }

  // Salva (cria ou atualiza) o produto.
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      downloadUrl: form.downloadUrl,
      active: form.active,
    };

    if (isEditing) {
      // Editar produto existente.
      await fetch(`/api/products/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Criar novo produto.
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    resetForm();
    loadData();
  }

  // Remove um produto (com confirmação).
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Painel Admin</h1>
      <p className="mt-2 text-gray-400">
        Gerencie produtos e acompanhe os pedidos.
      </p>

      {/* FORMULÁRIO DE PRODUTO (criar/editar) */}
      <section className="mt-8 card p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {isEditing ? "Editar produto" : "Criar produto"}
        </h2>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nome</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Preço (R$)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Categoria</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">URL da imagem</label>
            <input
              className="input"
              value={form.image}
              onChange={(e) => setField("image", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Descrição</label>
            <textarea
              className="input min-h-[90px]"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          <div>
            <label className="label">URL de download</label>
            <input
              className="input"
              value={form.downloadUrl}
              onChange={(e) => setField("downloadUrl", e.target.value)}
              placeholder="/downloads/arquivo.zip"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setField("active", e.target.checked)}
                className="h-4 w-4 accent-brand-purple"
              />
              Produto ativo (visível no catálogo)
            </label>
          </div>

          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar produto"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* LISTA DE PRODUTOS */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Produtos ({products.length})
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-dark-600">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-dark-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-dark-600">
                  <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.category}</td>
                  <td className="px-4 py-3 text-gray-300">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className="text-green-400">Sim</span>
                    ) : (
                      <span className="text-gray-500">Não</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-md border border-dark-500 px-3 py-1.5 text-xs text-gray-200 hover:border-brand-purple"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* LISTA DE PEDIDOS */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Pedidos ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">Nenhum pedido ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-dark-600">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-dark-700 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-dark-600">
                    <td className="px-4 py-3 font-medium text-white">{o.productName}</td>
                    <td className="px-4 py-3 text-gray-400">{o.userEmail}</td>
                    <td className="px-4 py-3 text-gray-300">{formatPrice(o.price)}</td>
                    <td className="px-4 py-3 text-green-400">{o.status}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
