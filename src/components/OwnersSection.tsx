// Seção "Donos / Fundadores" na home.
// A FOTO é puxada do banco: se o owner tiver conta no site (username abaixo)
// e foto de perfil enviada, ela aparece automaticamente aqui.
// EDITAR AQUI nome, número, cargo, stat, bio e o "username" do site.
// (Se quiser fixar uma foto sem depender de conta, preencha "photo".)
import { createClient } from "@/lib/supabase/server";

const OWNERS = [
  {
    name: "Fg",
    user: "1",
    role: "Fundador Badges Market",
    stat: "+200 Pigs Vendidas",
    bio: "Fundador do Badges Market. Referência em contas raras e atendimento de confiança.",
    username: "1", // username da conta no site (usado para puxar a foto)
    photo: "", // foto fixa opcional (URL ou /arquivo em public). Vazio = usa a do banco.
  },
  {
    name: "K4ss",
    user: "2",
    role: "Fundador Badges Market",
    stat: "+350 Pigs Vendidas",
    bio: "Farmo aura no recreio da escola",
    username: "2",
    photo: "",
  },
];

export default async function OwnersSection() {
  // Busca as fotos no banco pelos usernames configurados.
  const supabase = createClient();
  const usernames = OWNERS.map((o) => o.username).filter(Boolean);
  const { data } = await supabase
    .from("public_profiles")
    .select("username, avatar_url")
    .in("username", usernames);

  // Mapa username(minúsculo) -> avatar_url.
  const avatarByUser = new Map<string, string | null>();
  (data ?? []).forEach((p: any) =>
    avatarByUser.set(String(p.username).toLowerCase(), p.avatar_url)
  );

  return (
    <section className="border-y border-dark-600 bg-dark-800/40">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-blurple">
            Quem somos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Os donos do Badges Market
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {OWNERS.map((o) => {
            // Prioridade: foto do banco -> foto fixa -> inicial do nome.
            const dbPhoto = avatarByUser.get(o.username.toLowerCase());
            const photo = dbPhoto || o.photo || "";

            return (
              <div key={o.name} className="card flex gap-5 p-6">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={o.name}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-brand-blurple/40"
                  />
                ) : (
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-3xl font-black text-white ring-2 ring-brand-blurple/40">
                    {o.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{o.name}</h3>
                    <span className="rounded-full bg-dark-700 px-2 py-0.5 text-xs text-gray-400">
                      UserName: {o.user}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-brand-blurple">
                    {o.role}
                  </p>
                  {o.stat && (
                    <p className="mt-1 text-sm font-semibold text-green-400">
                      {o.stat}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {o.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
