"use client";

// CADASTRO ("/registrar") — username + email + senha.
// Validações: email válido, senha >= 8, username/email únicos.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Regex simples para validar formato de email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Username: 3-20 caracteres, letras, números, _ e .
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,20}$/;

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = username.trim();
    const mail = email.trim().toLowerCase();

    // --- Validações no cliente ---
    if (!USERNAME_RE.test(user)) {
      return setError(
        "Username inválido (use 3 a 20 caracteres: letras, números, _ ou .)."
      );
    }
    if (!EMAIL_RE.test(mail)) {
      return setError("Digite um email válido.");
    }
    if (password.length < 8) {
      return setError("A senha precisa ter no mínimo 8 caracteres.");
    }
    if (password !== confirm) {
      return setError("As senhas não conferem.");
    }

    setLoading(true);
    try {
      // 1) Verifica se o username já existe (RPC no banco).
      const { data: available, error: rpcErr } = await supabase.rpc(
        "is_username_available",
        { name: user }
      );
      if (rpcErr) throw rpcErr;
      if (!available) {
        setLoading(false);
        return setError("Esse username já está em uso.");
      }

      // 2) Cria a conta no Supabase Auth. O username vai nos metadados e a
      //    trigger do banco cria o profile automaticamente.
      const { data, error: signErr } = await supabase.auth.signUp({
        email: mail,
        password,
        options: { data: { username: user } },
      });

      if (signErr) {
        setLoading(false);
        // Email duplicado costuma vir como "User already registered".
        if (/already/i.test(signErr.message)) {
          return setError("Já existe uma conta com este email.");
        }
        return setError(signErr.message);
      }

      // 3) Se o projeto exige confirmação de email, não há sessão ainda.
      if (!data.session) {
        setLoading(false);
        setSuccess(
          "Conta criada! Confirme seu email e depois faça login."
        );
        return;
      }

      // Sessão criada -> vai direto para o painel.
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? "Erro ao criar a conta.");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-gray-400">
          Cadastre-se para anunciar suas contas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input"
              placeholder="seu_user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              Senha (mín. 8 caracteres)
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

          <div>
            <label className="label" htmlFor="confirm">
              Confirmar senha
            </label>
            <input
              id="confirm"
              type="password"
              className="input"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-brand-purple hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
