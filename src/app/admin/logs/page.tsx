// LOGS DOS ANÚNCIOS ("/admin/logs") — auditoria: criado, editado,
// ativado/desativado, excluído, com quem fez e de quem é. Acesso admin/owner.
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageAll } from "@/lib/types";
import type { Profile, UserRole } from "@/lib/types";

export const dynamic = "force-dynamic";

interface LogRow {
  id: string;
  product_title: string | null;
  action: string;
  actor_username: string | null;
  owner_username: string | null;
  created_at: string;
}

// Cor/rótulo de cada tipo de ação.
const ACTION_STYLES: Record<string, string> = {
  criado: "bg-green-500/15 text-green-400",
  editado: "bg-blue-500/15 text-blue-400",
  ativado: "bg-emerald-500/15 text-emerald-400",
  desativado: "bg-yellow-500/15 text-yellow-400",
  excluido: "bg-red-500/15 text-red-400",
};

export default async function LogsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Confere o cargo no servidor.
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const myRole = (me as Pick<Profile, "role"> | null)?.role as UserRole | undefined;
  if (!canManageAll(myRole)) redirect("/dashboard");

  // Busca os logs mais recentes.
  const { data } = await supabase
    .from("product_logs")
    .select("id, product_title, action, actor_username, owner_username, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const logs = (data as LogRow[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Logs dos anúncios</h1>
          <p className="mt-2 text-gray-400">
            Histórico de criação, edição, status e exclusão de anúncios.
          </p>
        </div>
        <Link href="/admin" className="btn-outline hidden sm:inline-flex">
          ← Voltar ao Admin
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          Nenhuma ação registrada ainda. Os logs aparecem conforme os anúncios
          são criados, editados ou excluídos.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-dark-600">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-dark-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Anúncio</th>
                <th className="px-4 py-3">De quem é (@)</th>
                <th className="px-4 py-3">Feito por (@)</th>
                <th className="px-4 py-3">Quando</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-dark-600">
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ACTION_STYLES[l.action] ?? "bg-dark-600 text-gray-300"
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {l.product_title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {l.owner_username ? "@" + l.owner_username : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {l.actor_username ? "@" + l.actor_username : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(l.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
