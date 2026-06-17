"use client";

// Tela de carregamento (splash) exibida rapidamente ao abrir o site.
// Some sozinha após um tempinho. EDITAR a duração em "DURATION".
import { useEffect, useState } from "react";

const DURATION = 1100; // ms que a tela fica visível

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), DURATION);
    // Remove do DOM após a animação de fade.
    const t2 = setTimeout(() => setRemoved(true), DURATION + 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-dark-900 transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="grid h-20 w-20 animate-pulse place-items-center rounded-2xl bg-brand-gradient text-4xl font-black text-white shadow-glow">
          B
        </span>
        <p className="text-lg font-bold tracking-tight text-white">
          Badges<span className="text-brand-purple">Market</span>
        </p>
        {/* Spinner */}
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-dark-500 border-t-brand-blurple" />
      </div>
    </div>
  );
}
