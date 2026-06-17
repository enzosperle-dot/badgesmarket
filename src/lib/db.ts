// =====================================================================
// CAMADA DE "BANCO DE DADOS" LOCAL (arquivos JSON)
//
// Este módulo lê e grava nos arquivos da pasta /data.
// IMPORTANTE: só roda no servidor (API Routes / Server Components),
// pois usa o módulo "fs" do Node.
//
// FUTURO: para integrar um banco real (Postgres, Supabase, MongoDB...),
// basta trocar as implementações abaixo mantendo as mesmas assinaturas.
// =====================================================================

import { promises as fs } from "fs";
import path from "path";
import type { Product, User, Order } from "./types";

// Caminho base da pasta de dados.
const DATA_DIR = path.join(process.cwd(), "data");

const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Função genérica para ler um arquivo JSON.
async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

// Função genérica para gravar um arquivo JSON (formatado).
async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// ----------------------- PRODUTOS -----------------------

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>(PRODUCTS_FILE);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = { id: Date.now().toString(), ...data };
  products.push(newProduct);
  await writeJson(PRODUCTS_FILE, products);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  await writeJson(PRODUCTS_FILE, products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await writeJson(PRODUCTS_FILE, filtered);
  return true;
}

// ----------------------- USUÁRIOS -----------------------

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>(USERS_FILE);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(
  data: Omit<User, "id" | "role"> & { role?: User["role"] }
): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    id: Date.now().toString(),
    role: data.role ?? "user",
    name: data.name,
    email: data.email,
    password: data.password,
  };
  users.push(newUser);
  await writeJson(USERS_FILE, users);
  return newUser;
}

// ----------------------- PEDIDOS -----------------------

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>(ORDERS_FILE);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter((o) => o.userId === userId);
}

export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "status"> & { status?: Order["status"] }
): Promise<Order> {
  const orders = await getOrders();
  const newOrder: Order = {
    id: "order-" + Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: data.status ?? "pago", // No MVP a compra é marcada como paga direto.
    userId: data.userId,
    userEmail: data.userEmail,
    productId: data.productId,
    productName: data.productName,
    price: data.price,
  };
  orders.push(newOrder);
  await writeJson(ORDERS_FILE, orders);
  return newOrder;
}
