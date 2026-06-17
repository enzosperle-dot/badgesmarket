import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Discord Market — Marketplace de contas de Discord",
  description:
    "Anuncie e visualize contas de Discord. Crie seu anúncio com imagem, título, descrição e valor.",
};

// O app depende de sessão/dados do Supabase (lidos em runtime), então
// renderizamos sob demanda em vez de gerar páginas estáticas no build.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
