// NOVO ANÚNCIO ("/anuncios/novo") — qualquer usuário logado pode criar.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdForm from "@/components/AdForm";

export const dynamic = "force-dynamic";

export default async function NewAdPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">Criar anúncio</h1>
      <AdForm />
    </div>
  );
}
