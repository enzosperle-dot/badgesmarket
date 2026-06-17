"use client";

// =====================================================================
// FORMULÁRIO DE ANÚNCIO (criar / editar)
//
// - Faz upload REAL da imagem no Supabase Storage (bucket product-images)
// - Aceita PNG, JPG e WEBP, até 5MB
// - Salva a URL pública no campo image_url
// - O RLS garante que o usuário só edite os próprios anúncios
//   (admin/owner podem editar qualquer um).
// =====================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { parsePrice, sanitizeText, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

// Tipos de imagem e tamanho permitidos.
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "product-images";

export default function AdForm({ product }: { product?: Product }) {
  const supabase = createClient();
  const router = useRouter();
  const isEditing = !!product;

  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  // Preço exibido no formato brasileiro.
  const [priceInput, setPriceInput] = useState(
    product ? formatPrice(product.price) : ""
  );
  const [active, setActive] = useState(product?.active ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Valida e prepara a imagem escolhida.
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Formato inválido. Use PNG, JPG ou WEBP.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Imagem muito grande. Limite de 5MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanTitle = sanitizeText(title, 120);
    const cleanDesc = sanitizeText(description, 2000);
    const price = parsePrice(priceInput);

    if (!cleanTitle) return setError("Informe um título.");
    if (price <= 0) return setError("Informe um valor válido (ex: R$ 49,90).");
    if (!isEditing && !file) return setError("Selecione uma imagem para o anúncio.");

    setLoading(true);
    try {
      // 1) Descobre o usuário logado.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return setError("Sessão expirada. Faça login novamente.");
      }

      // 2) Se há nova imagem, faz upload no Storage e pega a URL pública.
      let imageUrl = product?.image_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        imageUrl = pub.publicUrl;
      }

      // 3) Cria ou atualiza o anúncio (o RLS valida a permissão no banco).
      if (isEditing) {
        const { error: dbErr } = await supabase
          .from("products")
          .update({
            title: cleanTitle,
            description: cleanDesc,
            price,
            active,
            image_url: imageUrl,
          })
          .eq("id", product!.id);
        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase.from("products").insert({
          user_id: user.id, // vincula o anúncio ao criador
          title: cleanTitle,
          description: cleanDesc,
          price,
          active,
          image_url: imageUrl,
        });
        if (dbErr) throw dbErr;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar o anúncio.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      {/* Imagem */}
      <div>
        <label className="label">Imagem (PNG, JPG ou WEBP — até 5MB)</label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Pré-visualização"
            className="mb-3 aspect-video w-full rounded-lg border border-dark-600 object-cover"
          />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
          className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-purple file:px-4 file:py-2 file:font-medium file:text-white hover:file:opacity-90"
        />
      </div>

      {/* Título */}
      <div>
        <label className="label">Título</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Conta Discord Nitro 2 anos"
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="label">Descrição</label>
        <textarea
          className="input min-h-[110px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes da conta..."
        />
      </div>

      {/* Valor */}
      <div>
        <label className="label">Valor (R$)</label>
        <input
          className="input"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          placeholder="R$ 49,90"
          inputMode="decimal"
          required
        />
      </div>

      {/* Ativo */}
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 accent-brand-purple"
        />
        Anúncio ativo (aparece no catálogo)
      </label>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading
            ? "Salvando..."
            : isEditing
            ? "Salvar alterações"
            : "Publicar anúncio"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
