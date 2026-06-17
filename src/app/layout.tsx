import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Metadados do site (aparecem na aba do navegador e no compartilhamento).
// EDITAR AQUI título e descrição do projeto.
export const metadata: Metadata = {
  title: "Badges Market — Marketplace de produtos digitais para Discord",
  description:
    "Compre templates de servidores, bots, packs de cargos, artes e serviços de configuração para Discord.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        {/* AuthProvider envolve todo o app para a sessão estar disponível em qualquer página. */}
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
