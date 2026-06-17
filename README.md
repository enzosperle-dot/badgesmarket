# 🟣 Badges Market

Marketplace digital de produtos para **Discord** — templates de servidores, bots, packs de cargos, artes e serviços de configuração.

MVP construído com **Next.js (App Router)**, **TypeScript** e **Tailwind CSS**, usando **arquivos JSON** como banco de dados local.

---

## 🚀 Como rodar

```bash
npm install      # instala as dependências
npm run dev      # inicia em modo desenvolvimento
```

Acesse: **http://localhost:3000**

Para build de produção:

```bash
npm run build
npm start
```

---

## 🔐 Contas de teste

| Tipo    | Email             | Senha     |
| ------- | ----------------- | --------- |
| Admin   | admin@badges.com  | admin123  |
| Usuário | user@badges.com   | user123   |

> O login é **simulado** (sessão salva no `localStorage`). Não use em produção.

---

## 📁 Estrutura do projeto

```
data/                      # "Banco de dados" em JSON (editável)
  ├── products.json        # Produtos (id, name, description, price, category, image, downloadUrl, active)
  ├── users.json           # Usuários
  └── orders.json          # Pedidos/compras

public/downloads/          # Arquivos digitais que os clientes baixam

src/
  ├── app/
  │   ├── page.tsx                 # Home (Hero + destaques)
  │   ├── login/                   # Login
  │   ├── registrar/               # Criar conta
  │   ├── catalogo/                # Catálogo + filtro por categoria
  │   ├── produto/[id]/            # Página do produto
  │   ├── dashboard/               # Painel do usuário (compras + downloads)
  │   ├── admin/                   # Painel admin (CRUD de produtos + pedidos)
  │   └── api/                     # Rotas de API (products, orders, auth)
  ├── components/                  # Navbar, Footer, Hero, ProductCard, BuyButton
  └── lib/
      ├── types.ts                 # Tipos e categorias  (EDITAR categorias aqui)
      ├── db.ts                    # Leitura/escrita dos JSON
      ├── auth.tsx                 # Contexto de login (simulado)
      └── format.ts                # Formatação de preço (BRL)
```

---

## ✏️ Onde editar

- **Produtos:** `data/products.json` (ou pelo painel **Admin**).
- **Categorias:** `src/lib/types.ts` → constante `CATEGORIES`.
- **Cores / tema:** `tailwind.config.ts` → `colors.brand` e `colors.dark`.
- **Estilos globais e botões:** `src/app/globals.css`.
- **Textos da Home:** `src/components/Hero.tsx` e `src/app/page.tsx`.

Os arquivos contêm comentários `EDITAR AQUI` indicando os pontos de personalização.

---

## 💳 Integração de pagamento (futuro)

O fluxo de compra está isolado em **`src/components/BuyButton.tsx`** e na rota **`src/app/api/orders/route.ts`**.

Hoje a compra cria um pedido com status `"pago"` automaticamente. Para integrar **Stripe** ou **Pix**:

1. Na API de orders, antes de marcar como pago, crie a sessão de checkout (Stripe) ou cobrança (Pix).
2. Redirecione o usuário para o pagamento.
3. Marque o pedido como `"pago"` apenas após a confirmação (webhook).

---

## ⚠️ Observações do MVP

- Sem banco externo: tudo em JSON local (as escritas funcionam em `npm run dev` / `npm start`, mas **não** em ambientes serverless somente-leitura como a Vercel — lá use um banco real).
- Senhas em texto puro apenas para demonstração — em produção use hash (bcrypt) e autenticação real (NextAuth, Clerk, Supabase...).
