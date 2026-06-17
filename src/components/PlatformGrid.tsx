// Grade de plataformas clicáveis. Cada ícone leva ao catálogo filtrado.
// EDITAR AQUI os ícones (emoji) de cada plataforma.
import Link from "next/link";

const PLATFORMS: { name: string; icon: string }[] = [
  { name: "Discord", icon: "🟣" },
  { name: "Instagram", icon: "📸" },
  { name: "TikTok", icon: "🎵" },
  { name: "Twitter / X", icon: "✖️" },
  { name: "Roblox", icon: "🟥" },
  { name: "Steam", icon: "🎮" },
  { name: "Epic Games", icon: "🛡️" },
  { name: "Free Fire", icon: "🔥" },
  { name: "Valorant", icon: "🔫" },
];

export default function PlatformGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-brand-blurple">
          Escolha a plataforma
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Clique e veja as contas
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 lg:grid-cols-9">
        {PLATFORMS.map((p) => (
          <Link
            key={p.name}
            href={`/catalogo?plataforma=${encodeURIComponent(p.name)}`}
            className="card flex flex-col items-center gap-2 p-4 text-center transition hover:border-brand-blurple hover:shadow-glow"
          >
            <span className="text-3xl">{p.icon}</span>
            <span className="text-xs font-medium text-gray-300">{p.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
