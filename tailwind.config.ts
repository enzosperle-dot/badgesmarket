import type { Config } from "tailwindcss";

const config: Config = {
  // Arquivos que o Tailwind analisa para gerar as classes usadas.
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // PALETA DE CORES — EDITAR AQUI para mudar a identidade visual do site.
      colors: {
        brand: {
          // Roxo/azul principal dos botões e destaques.
          purple: "#7c3aed",
          purpleDark: "#6d28d9",
          blue: "#3b82f6",
          blueDark: "#2563eb",
          // "Blurple" oficial do Discord — usado em detalhes.
          blurple: "#5865f2",
        },
        // Tons de fundo escuro.
        dark: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a24",
          600: "#23232f",
          500: "#2e2e3d",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 58, 237, 0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
