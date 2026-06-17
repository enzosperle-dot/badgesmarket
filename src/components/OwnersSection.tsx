// Seção "Donos / Fundadores" na home.
// EDITAR AQUI os dados dos owners (nome, número de user, cargo, stats, bio).
// Para trocar a foto, coloque uma URL em "photo" (ex: link do avatar do Discord).
const OWNERS = [
  {
    name: "Fg",
    user: "157",
    role: "Fundador Badges Market",
    stat: "+200 Pigs Vendidas",
    bio: "Fundador do Badges Market. Referência em contas raras e atendimento de confiança.",
    photo: "", // URL da foto (deixe vazio para usar a inicial)
  },
  {
    name: "Owner 2",
    user: "—",
    role: "Co-fundador Badges Market",
    stat: "",
    bio: "Edite este card em src/components/OwnersSection.tsx com os dados do segundo owner.",
    photo: "",
  },
];

export default function OwnersSection() {
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
          {OWNERS.map((o) => (
            <div key={o.name} className="card flex gap-5 p-6">
              {/* Foto ou inicial */}
              {o.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={o.photo}
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
                    USER: {o.user}
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
          ))}
        </div>
      </div>
    </section>
  );
}
