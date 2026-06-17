// POST /api/auth/register — cria um novo usuário em users.json.
import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Preencha nome, email e senha." },
      { status: 400 }
    );
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "Já existe uma conta com este email." },
      { status: 409 }
    );
  }

  const user = await createUser({ name, email, password, role: "user" });
  const { password: _omit, ...safeUser } = user;
  return NextResponse.json({ user: safeUser }, { status: 201 });
}
