// POST /api/auth/login — valida email e senha contra users.json.
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Informe email e senha." },
      { status: 400 }
    );
  }

  const user = await getUserByEmail(email);
  // ATENÇÃO: comparação de senha em texto puro (apenas para o MVP).
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Email ou senha incorretos." },
      { status: 401 }
    );
  }

  // Remove a senha antes de devolver ao cliente.
  const { password: _omit, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
