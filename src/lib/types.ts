// =====================================================================
// TIPOS GLOBAIS
// =====================================================================

// Cargos do sistema.
export type UserRole = "user" | "seller" | "admin" | "owner";

// Lista usada nos seletores de cargo do painel admin.
export const ROLES: UserRole[] = ["user", "seller", "admin", "owner"];

// Perfil do usuário (tabela profiles). A senha NUNCA fica aqui.
export interface Profile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
}

// Anúncio/produto (tabela products).
export interface Product {
  id: string;
  user_id: string;
  image_url: string | null;
  title: string;
  description: string | null;
  price: number;
  active: boolean;
  created_at: string;
}

// Item do catálogo público (view "catalog") — inclui o nome do vendedor.
export interface CatalogItem {
  id: string;
  user_id: string;
  image_url: string | null;
  title: string;
  description: string | null;
  price: number;
  created_at: string;
  seller_username: string;
}

// Pedido (tabela orders).
export interface Order {
  id: string;
  product_id: string | null;
  buyer_id: string | null;
  status: string;
  created_at: string;
}

// Helpers de permissão (usados no frontend; o RLS garante no banco).
export const canManageAll = (role?: UserRole) =>
  role === "admin" || role === "owner";

export const canManageRoles = (role?: UserRole) => role === "owner";
