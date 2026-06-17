// Grade de plataformas com LOGOS SVG reais e efeito de relevo no hover.
// Cada ícone leva ao catálogo filtrado por aquela plataforma.
// EDITAR AQUI: para trocar a cor do brilho/ícone, mude "color".
import Link from "next/link";
import type { ReactNode } from "react";

const cls = "h-9 w-9";

// SVGs das marcas (traços simplificados, em currentColor).
const ICONS: Record<string, ReactNode> = {
  Discord: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  "Twitter / X": (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.49-6.933zm-1.292 19.482h2.039L6.486 3.24H4.298l13.311 17.395z" />
    </svg>
  ),
  Roblox: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.164 0 0 19.236 18.836 24 24 4.763 5.164 0Zm6.367 8.867 3.6.965-.964 3.599-3.6-.964.964-3.6Z"
      />
    </svg>
  ),
  Steam: (
    <svg viewBox="0 0 24 24" className={cls} aria-hidden>
      <circle cx="11.6" cy="12" r="9.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.1" cy="8.7" r="2.7" fill="currentColor" />
      <circle cx="9.2" cy="14.4" r="2.1" fill="currentColor" />
      <path d="M2.7 15.2l4.9 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  "Epic Games": (
    <svg viewBox="0 0 24 24" className={cls} aria-hidden>
      <rect x="3.5" y="2.5" width="17" height="19" rx="4" fill="currentColor" />
      <g fill="#13131b">
        <rect x="8" y="6.3" width="2" height="11.4" />
        <rect x="8" y="6.3" width="6.4" height="2" />
        <rect x="8" y="11" width="5" height="2" />
        <rect x="8" y="15.7" width="6.4" height="2" />
      </g>
    </svg>
  ),
  "Free Fire": (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M13 2c.6 2.6 2.2 3.5 3.3 5.3 1.5 2.4 1.2 5.6-.8 7.6a5.6 5.6 0 01-9.5-4c0-2 .9-3.4 1.9-4.6.2 1 .8 1.9 1.7 2.3C9.3 9 10.8 5.7 13 2z" />
    </svg>
  ),
  Valorant: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M2.2 4l8.7 10.9v4.7L2.2 8.7V4zm19.6 0v4.7l-6.8 8.5h-4.1L21.8 4z" />
    </svg>
  ),
};

// Plataforma + cor da marca (usada no ícone e no brilho do hover).
const PLATFORMS: { name: string; color: string }[] = [
  { name: "Discord", color: "#5865F2" },
  { name: "Instagram", color: "#E4405F" },
  { name: "TikTok", color: "#25F4EE" },
  { name: "Twitter / X", color: "#FFFFFF" },
  { name: "Roblox", color: "#FFFFFF" },
  { name: "Steam", color: "#66C0F4" },
  { name: "Epic Games", color: "#FFFFFF" },
  { name: "Free Fire", color: "#FF7A00" },
  { name: "Valorant", color: "#FD4556" },
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
            // A cor da marca vira uma variável CSS usada no brilho/borda do hover.
            style={{ ["--bc" as string]: p.color }}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-dark-600 bg-dark-800 p-5 text-center transition-all duration-200 ease-out hover:-translate-y-2 hover:border-[color:var(--bc)] hover:shadow-[0_16px_38px_-12px_var(--bc)]"
          >
            <span
              className="text-gray-300 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
              style={{ color: "var(--bc)" }}
            >
              {ICONS[p.name]}
            </span>
            <span className="text-xs font-medium text-gray-400 transition-colors group-hover:text-white">
              {p.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
