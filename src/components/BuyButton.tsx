"use client";

// =====================================================================
// BOTÃO DE COMPRA
//
// No MVP, comprar = criar um pedido (status "pago") via /api/orders.
// Se o usuário não estiver logado, redireciona para o login.
//
// FUTURO (Stripe/Pix): troque a chamada abaixo por uma que cria a
// sessão de checkout e redireciona para a página de pagamento.
// =====================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export default function BuyButton({
  product,
  size = "md",
}: {
  product: Product;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleBuy() {
    // Sem login -> manda para a página de entrar.
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          productId: product.id,
        }),
      });
      if (res.ok) {
        setDone(true);
        // Leva o usuário ao painel para ver a compra e o download.
        setTimeout(() => router.push("/dashboard"), 800);
      }
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses = size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3";

  return (
    <button
      onClick={handleBuy}
      disabled={loading || done}
      className={`btn-primary ${sizeClasses}`}
    >
      {done ? "Comprado ✓" : loading ? "Processando..." : "Comprar"}
    </button>
  );
}
