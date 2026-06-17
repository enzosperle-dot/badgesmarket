// /api/orders
//   GET  -> lista pedidos. Use ?userId=... para filtrar pelas compras de um usuário.
//   POST -> cria um pedido (chamado quando o usuário clica em "Comprar").
//
// FUTURO (pagamento real): antes de criar o pedido com status "pago",
// você criaria uma sessão de checkout (Stripe) ou cobrança (Pix) e só
// marcaria como pago após a confirmação via webhook.
import { NextResponse } from "next/server";
import { getOrders, getOrdersByUser, createOrder, getProductById } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const orders = userId ? await getOrdersByUser(userId) : await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const { userId, userEmail, productId } = await request.json();

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "Usuário e produto são obrigatórios." },
      { status: 400 }
    );
  }

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const order = await createOrder({
    userId,
    userEmail: userEmail ?? "",
    productId: product.id,
    productName: product.name,
    price: product.price,
    status: "pago", // simulação de pagamento aprovado
  });

  return NextResponse.json(order, { status: 201 });
}
