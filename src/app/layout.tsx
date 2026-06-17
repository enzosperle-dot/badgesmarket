import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Badges Market — Compre e venda contas de Discord",
  description:
    "Marketplace de contas de Discord com badges raras. Entrega rápida e suporte dedicado. Encontre ou anuncie a sua conta.",
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
          <LoadingScreen />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
