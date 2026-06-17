// Cliente Supabase para uso no SERVIDOR (Server Components, Route Handlers).
// Usa os cookies da requisição para manter a sessão do usuário.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Em Server Components a escrita de cookies pode falhar — o
          // middleware cuida de renovar a sessão, então ignoramos o erro.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* noop */
          }
        },
      },
    }
  );
}
