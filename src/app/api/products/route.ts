// /api/products
//   GET  -> lista todos os produtos
//   POST -> cria um novo produto (usado pelo Admin)
import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validação simples dos campos obrigatórios.
  if (!body.name || body.price === undefined || !body.category) {
    return NextResponse.json(
      { error: "Nome, preço e categoria são obrigatórios." },
      { status: 400 }
    );
  }

  const product = await createProduct({
    name: body.name,
    description: body.description ?? "",
    price: Number(body.price),
    category: body.category,
    image: body.image ?? "",
    downloadUrl: body.downloadUrl ?? "",
    active: body.active ?? true,
  });

  return NextResponse.json(product, { status: 201 });
}
