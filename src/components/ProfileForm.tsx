"use client";

// =====================================================================
// FORMULÁRIO DE PERFIL
// Permite trocar foto, nome de exibição, @ do Discord e bio.
// O @ do Discord é obrigatório para poder anunciar (é por onde o
// comprador entra em contato, já que o user do site != user do Discord).
// =====================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { sanitizeText } from "@/lib/format";
import type { Profile } from "@/lib/types";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const BUCKET = "product-images"; // reutilizamos o bucket público

export default function ProfileForm({
  profile,
  aviso,
}: {
  profile: Profile;
  aviso?: boolean; // veio redirecionado por falta de @ do Discord
}) {
  const supabase = createClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(
    profile.display_name ?? profile.username
  );
  // Mostra sem o "@" no campo; guardamos sem o "@".
  const [discord, setDiscord] = useState((profile.discord_tag ?? "").replace(/^@/, ""));
  const [bio, setBio] = useState(profile.bio ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profile.avatar_url ?? null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) return setError("Use PNG, JPG ou WEBP.");
    if (f.size > MAX_SIZE) return setError("Imagem muito grande (máx. 5MB).");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = sanitizeText(displayName, 40);
    const cleanDiscord = sanitizeText(discord, 40).replace(/^@/, "");
    const cleanBio = sanitizeText(bio, 300);

    if (!cleanName) return setError("Informe um nome de exibição.");
    if (!cleanDiscord) return setError("Informe seu @ do Discord.");

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return setError("Sessão expirada. Faça login novamente.");
      }

      // Upload do avatar, se houver novo.
      let avatarUrl = profile.avatar_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `avatars/${user.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        avatarUrl = pub.publicUrl;
      }

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({
          display_name: cleanName,
          discord_tag: cleanDiscord,
          bio: cleanBio,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);
      if (dbErr) throw dbErr;

      setSuccess("Perfil salvo com sucesso!");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      {aviso && (
        <p className="rounded-lg bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          Para anunciar, primeiro preencha seu <strong>@ do Discord</strong> aqui
          embaixo e salve. É por ele que os compradores vão te chamar.
        </p>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto de perfil"
            className="h-20 w-20 rounded-2xl border border-dark-600 object-cover"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-gradient text-3xl font-black text-white">
            {(displayName || profile.username).charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <label className="label">Foto de perfil</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            className="block text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-purple file:px-3 file:py-1.5 file:font-medium file:text-white hover:file:opacity-90"
          />
        </div>
      </div>

      {/* Nome de exibição */}
      <div>
        <label className="label">Nome de exibição</label>
        <input
          className="input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Como você quer aparecer"
        />
      </div>

      {/* @ do Discord */}
      <div>
        <label className="label">@ do Discord (obrigatório para anunciar)</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">@</span>
          <input
            className="input"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="seu_user_do_discord"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          O usuário do site não é o mesmo do Discord — informe aqui como te
          encontrar lá.
        </p>
      </div>

      {/* Bio */}
      <div>
        <label className="label">Bio (opcional)</label>
        <textarea
          className="input min-h-[80px]"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Fale um pouco sobre você / sua loja"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400">
          {success}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Salvando..." : "Salvar perfil"}
      </button>
    </form>
  );
}
