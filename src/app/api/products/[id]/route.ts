// /api/products/[id]
//   GET    -> retorna um produto
//   PUT    -> atualiza um produto (Admin)
//   DELETE -> remove um produto (Admin)
import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const product = await getProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await updateProduct(params.id, {
    ...body,
    // Garante que o preço seja número se vier preenchido.
    ...(body.price !== undefined ? { price: Number(body.price) } : {}),
  });
  if (!updated) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ok = await deleteProduct(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
