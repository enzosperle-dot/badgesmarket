// =====================================================================
// TIPOS GLOBAIS
// =====================================================================

// Cargos do sistema.
export type UserRole = "user" | "seller" | "admin" | "owner";

// Lista usada nos seletores de cargo do painel admin.
export const ROLES: UserRole[] = ["user", "seller", "admin", "owner"];

// Tipo da conta anunciada.
export type AccountType = "mudavel" | "og";

// Plataformas suportadas (usadas no anúncio e nos filtros da home/catálogo).
export const PLATFORMS = [
  "Discord",
  "Instagram",
  "TikTok",
  "Twitter / X",
  "Roblox",
  "Steam",
  "Epic Games",
  "Free Fire",
  "Valorant",
] as const;

// Perfil do usuário (tabela profiles). A senha NUNCA fica aqui.
export interface Profile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
  display_name: string | null;
  discord_tag: string | null;
  avatar_url: string | null;
  bio: string | null;
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
  account_type: AccountType;
  platform: string;
}

// Item do catálogo público (view "catalog") — inclui dados do vendedor.
export interface CatalogItem {
  id: string;
  user_id: string;
  image_url: string | null;
  title: string;
  description: string | null;
  price: number;
  created_at: string;
  account_type: AccountType;
  platform: string;
  seller_username: string;
  seller_display_name: string | null;
  seller_avatar: string | null;
  seller_discord: string | null;
}

// Pedido (tabela orders).
export interface Order {
  id: string;
  product_id: string | null;
  buyer_id: string | null;
  status: string;
  created_at: string;
}

// Helpers de permissão (o RLS garante no banco).
export const canManageAll = (role?: UserRole) =>
  role === "admin" || role === "owner";

export const canManageRoles = (role?: UserRole) => role === "owner";

// Rótulo amigável do tipo de conta.
export const accountTypeLabel = (t?: AccountType) =>
  t === "og" ? "OG" : "Mudável";
