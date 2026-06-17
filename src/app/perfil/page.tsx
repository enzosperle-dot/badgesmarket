// PÁGINA DE PERFIL ("/perfil") — editar foto, nome, @ do Discord e bio.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { aviso?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;
  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">Meu perfil</h1>
      <p className="mb-6 text-sm text-gray-400">
        Configure como você aparece e como os compradores entram em contato.
      </p>
      <ProfileForm profile={profile} aviso={searchParams.aviso === "discord"} />
    </div>
  );
}
