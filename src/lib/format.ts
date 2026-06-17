// =====================================================================
// Helpers de preço em Reais (R$).
// =====================================================================

// Formata um número para "R$ 49,90".
export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Converte texto digitado pelo usuário ("R$ 1.234,56", "49,90", "49.90")
// em número (1234.56 / 49.9). Retorna 0 se não der para converter.
export function parsePrice(input: string): number {
  if (!input) return 0;
  let s = String(input).replace(/[^\d.,]/g, "").trim();
  if (!s) return 0;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // Formato brasileiro: ponto = milhar, vírgula = decimal.
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    // Só vírgula -> decimal.
    s = s.replace(",", ".");
  }
  // Só ponto -> já está no formato com decimal.

  const n = parseFloat(s);
  return isNaN(n) ? 0 : Math.max(0, n);
}

// Sanitiza texto simples: remove espaços nas pontas e limita o tamanho.
export function sanitizeText(input: string, maxLength = 2000): string {
  return String(input ?? "").trim().slice(0, maxLength);
}
