// EDITAR ANÚNCIO ("/anuncios/[id]/editar")
// O RLS só retorna o anúncio se o usuário tiver permissão (dono ou admin/owner).
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdForm from "@/components/AdForm";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditAdPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Busca o anúncio. Se o RLS não permitir, "data" vem nulo -> 404.
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  const product = data as Product | null;
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">Editar anúncio</h1>
      <AdForm product={product} />
    </div>
  );
}
