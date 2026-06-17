// NOVO ANÚNCIO ("/anuncios/novo") — qualquer usuário logado pode criar,
// MAS só depois de preencher o @ do Discord no perfil.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdForm from "@/components/AdForm";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewAdPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verifica se o @ do Discord está preenchido.
  const { data } = await supabase
    .from("profiles")
    .select("discord_tag")
    .eq("id", user.id)
    .single();

  const profile = data as Pick<Profile, "discord_tag"> | null;
  if (!profile?.discord_tag) {
    // Sem @ do Discord -> manda configurar o perfil primeiro.
    redirect("/perfil?aviso=discord");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">Criar anúncio</h1>
      <AdForm />
    </div>
  );
}
