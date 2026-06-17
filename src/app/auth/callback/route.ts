// =====================================================================
// CALLBACK de autenticação (fluxo com "code" / PKCE)
//
// Usado quando o link de confirmação ou de recuperação de senha redireciona
// para {{ .SiteURL }}/auth/callback?code=... . Trocamos o code por uma
// sessão (gravando os cookies) e redirecionamos.
// =====================================================================

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmacao`);
}
