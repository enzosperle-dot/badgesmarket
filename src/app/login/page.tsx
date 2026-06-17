"use client";

// PÁGINA DE LOGIN (rota "/login")
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Não foi possível entrar.");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-white">Entrar</h1>
        <p className="mt-1 text-sm text-gray-400">
          Acesse sua conta para ver suas compras.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Mensagem de erro */}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Não tem conta?{" "}
          <Link href="/registrar" className="font-medium text-brand-purple hover:underline">
            Criar conta
          </Link>
        </p>

        {/* Dica de credenciais de teste (REMOVER em produção) */}
        <div className="mt-6 rounded-lg border border-dark-600 bg-dark-700/50 p-3 text-xs text-gray-500">
          <p className="font-medium text-gray-400">Contas de teste:</p>
          <p>admin@badges.com / admin123 (admin)</p>
          <p>user@badges.com / user123 (usuário)</p>
        </div>
      </div>
    </div>
  );
}
