// DASHBOARD ("/dashboard") — perfil + anúncios do próprio usuário.
// Server Component: a sessão é validada no servidor (e no middleware).
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import DeleteAdButton from "@/components/DeleteAdButton";
import type { Product, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Perfil + anúncios do usuário.
  const [{ data: profileData }, { data: productsData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileData as Profile | null;
  const products = (productsData as Product[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Meus anúncios</h1>
        <Link href="/anuncios/novo" className="btn-primary">
          + Novo anúncio
        </Link>
      </div>

      {/* Dados da conta */}
      <section className="mt-6 card p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Dados da conta</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Info label="Username" value={"@" + (profile?.username ?? "")} />
          <Info label="Email" value={profile?.email ?? user.email ?? ""} />
          <Info label="Cargo" value={profile?.role ?? "user"} />
        </div>
      </section>

      {/* Lista de anúncios */}
      <section className="mt-8">
        {products.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-400">Você ainda não criou nenhum anúncio.</p>
            <Link href="/anuncios/novo" className="btn-primary mt-4">
              Criar meu primeiro anúncio
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url ?? ""}
                  alt={p.title}
                  className="h-20 w-32 shrink-0 rounded-lg border border-dark-600 object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{p.title}</p>
                  <p className="text-sm text-gray-400">
                    {formatPrice(p.price)} •{" "}
                    {p.active ? (
                      <span className="text-green-400">ativo</span>
                    ) : (
                      <span className="text-gray-500">inativo</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/anuncios/${p.id}/editar`}
                    className="rounded-md border border-dark-500 px-3 py-1.5 text-xs text-gray-200 transition hover:border-brand-purple"
                  >
                    Editar
                  </Link>
                  <DeleteAdButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-dark-600 bg-dark-700/50 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}
