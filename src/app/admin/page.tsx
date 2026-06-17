// PAINEL ADMIN ("/admin")
// Acesso só para admin/owner (validado no servidor + middleware + RLS).
// - Lista usuários e permite ao OWNER alterar cargos
// - Lista todos os anúncios (editar / excluir)
// - Lista todos os pedidos
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { canManageAll, canManageRoles } from "@/lib/types";
import type { Profile, Order, UserRole } from "@/lib/types";
import RoleSelect from "@/components/RoleSelect";
import DeleteAdButton from "@/components/DeleteAdButton";

export const dynamic = "force-dynamic";

// Produto + username do vendedor (join com profiles).
interface AdminProduct {
  id: string;
  title: string;
  price: number;
  active: boolean;
  user_id: string;
  profiles: { username: string } | null;
}

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Confere o cargo no servidor (defesa extra além do middleware/RLS).
  const { data: me } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const myRole = (me as Profile | null)?.role as UserRole | undefined;
  if (!canManageAll(myRole)) redirect("/dashboard");

  // Carrega dados (o RLS já libera tudo para admin/owner).
  const [{ data: users }, { data: products }, { data: orders }] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at"),
      supabase
        .from("products")
        .select("id, title, price, active, user_id, profiles(username)")
        .order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);

  const userList = (users as Profile[]) ?? [];
  const productList = (products as unknown as AdminProduct[]) ?? [];
  const orderList = (orders as Order[]) ?? [];
  const owner = canManageRoles(myRole);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Painel Admin</h1>
      <p className="mt-2 text-gray-400">
        Logado como <span className="text-brand-purple">{myRole}</span>.
        {owner
          ? " Você pode alterar cargos."
          : " Apenas o owner pode alterar cargos."}
      </p>

      {/* USUÁRIOS */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Usuários ({userList.length})
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-dark-600">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-dark-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((u) => (
                <tr key={u.id} className="border-t border-dark-600">
                  <td className="px-4 py-3 font-medium text-white">
                    @{u.username}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <RoleSelect
                      userId={u.id}
                      currentRole={u.role}
                      canEdit={owner}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ANÚNCIOS */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Anúncios ({productList.length})
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-dark-600">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-dark-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Vendedor</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((p) => (
                <tr key={p.id} className="border-t border-dark-600">
                  <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                  <td className="px-4 py-3 text-gray-400">
                    @{p.profiles?.username ?? "?"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className="text-green-400">Sim</span>
                    ) : (
                      <span className="text-gray-500">Não</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/anuncios/${p.id}/editar`}
                        className="rounded-md border border-dark-500 px-3 py-1.5 text-xs text-gray-200 hover:border-brand-purple"
                      >
                        Editar
                      </Link>
                      <DeleteAdButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PEDIDOS */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Pedidos ({orderList.length})
        </h2>
        {orderList.length === 0 ? (
          <p className="text-gray-400">Nenhum pedido registrado.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-dark-600">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-dark-700 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((o) => (
                  <tr key={o.id} className="border-t border-dark-600">
                    <td className="px-4 py-3 text-gray-300">{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-gray-400">{o.status}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(o.created_at).toLocaleDateString("pt-BR")}
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
