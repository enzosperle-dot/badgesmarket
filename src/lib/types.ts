// =====================================================================
// TIPOS GLOBAIS DO PROJETO
// EDITAR AQUI se quiser adicionar/remover campos das entidades.
// =====================================================================

// Produto digital vendido no marketplace.
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  downloadUrl: string;
  active: boolean;
}

// Usuário do site. No MVP a senha fica em texto puro — em produção use hash (bcrypt).
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

// Versão "pública" do usuário (sem a senha) — usada no frontend/sessão.
export type SafeUser = Omit<User, "password">;

// Pedido/compra realizada.
export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  productName: string;
  price: number;
  status: "pendente" | "pago";
  createdAt: string;
}

// Categorias disponíveis no catálogo.
// EDITAR AQUI para adicionar novas categorias de produto.
export const CATEGORIES = [
  "Templates",
  "Bots",
  "Cargos",
  "Artes",
  "Serviços",
] as const;
