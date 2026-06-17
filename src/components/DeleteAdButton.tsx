"use client";

// Botão de excluir anúncio. O RLS garante que só o dono (ou admin/owner)
// consiga excluir de fato.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAdButton({ id }: { id: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setLoading(false);
    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      {loading ? "..." : "Excluir"}
    </button>
  );
}
