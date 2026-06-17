# 🎮 Discord Market

Marketplace de **contas de Discord**. Qualquer usuário logado cria anúncios (imagem, título, descrição e valor). O catálogo é **apenas para visualização** — não há compra, só o botão **Visualizar**.

Stack: **Next.js (App Router) · TypeScript · Tailwind CSS · Supabase** (Banco, Auth e Storage).

---

## 🧩 Funcionalidades

- **Cadastro** com username + email + senha (username/email únicos, email válido, senha ≥ 8).
- **Login / Logout** via Supabase Auth, com sessão por cookies e rotas privadas protegidas.
- **Cargos**: `user`, `seller`, `admin`, `owner`. O email **fgzinfps@gmail.com** vira `owner` automaticamente.
- **Anúncios**: qualquer usuário cria/edita/exclui os **seus**; admin/owner gerenciam **todos**.
- **Upload de imagem** real no Supabase Storage (bucket `product-images`, PNG/JPG/WEBP, até 5MB).
- **Painel Admin** (`/admin`): lista usuários, owner altera cargos, editar/excluir qualquer anúncio, ver pedidos.
- **Segurança**: senha só no Supabase Auth, permissões via **RLS** no banco, validação no servidor e inputs sanitizados.

---

## 🚀 Passo a passo para rodar

### 1. Criar o projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) → **New project**.
2. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**.

### 2. Rodar o SQL
1. No Supabase, abra **SQL Editor**.
2. Cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   - Isso cria as tabelas (`profiles`, `products`, `orders`), as políticas RLS, os cargos, a trigger de perfil e o bucket `product-images`.

### 3. Ajustar o Auth (login imediato no MVP)
- Em **Authentication → Providers → Email**, **desative** a opção **"Confirm email"**.
  (Assim o usuário entra logo após o cadastro, sem precisar confirmar email.)

### 4. Configurar as variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Preencha o `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### 5. Instalar e rodar
```bash
npm install
npm run dev
```
Abra **http://localhost:3000**.

### 6. Virar owner
Cadastre-se com o email **fgzinfps@gmail.com** — a trigger do banco já define o cargo `owner`. Depois acesse **/admin**.

---

## 📁 Estrutura

```
supabase/schema.sql            # SQL completo (tabelas + RLS + storage + triggers)
middleware.ts                  # Renova sessão e protege rotas privadas

src/
  app/
    page.tsx                   # Home (anúncios recentes)
    catalogo/                  # Catálogo (anúncios ativos)
    produto/[id]/              # Visualizar anúncio (sem compra)
    login/  registrar/         # Auth
    dashboard/                 # Meus anúncios (perfil + CRUD próprio)
    anuncios/novo/             # Criar anúncio
    anuncios/[id]/editar/      # Editar anúncio
    admin/                     # Painel admin
  components/                  # Navbar, Footer, Hero, ProductCard, AdForm, etc.
  lib/
    supabase/                  # Clients (browser, server, middleware)
    auth.tsx                   # Contexto de auth (cliente)
    types.ts                   # Tipos e helpers de permissão
    format.ts                  # Preço (R$) e sanitização
```

---

## 🔐 Como a segurança funciona

- **Senhas**: nunca tocadas pelo app — ficam no Supabase Auth (`auth.users`).
- **RLS** (no banco) é a fonte da verdade das permissões:
  - todos veem anúncios **ativos**;
  - o dono edita/exclui os **seus**;
  - admin/owner gerenciam **todos**;
  - só o **owner** altera cargos (RPC `set_user_role` + trigger anti-escalonamento).
- **Servidor**: o middleware bloqueia rotas privadas sem sessão; o `/admin` ainda revalida o cargo.
- **Catálogo público** usa a view `catalog`, que expõe só o `username` do vendedor (nunca o email).

---

## 💡 Observações

- O bucket `product-images` é público (URLs de imagem abertas) — ideal para fotos de anúncio.
- A tabela `orders` existe para uso futuro; como não há compra, o painel mostra a lista vazia.
- Para deploy (ex: **Vercel**), configure as mesmas variáveis `NEXT_PUBLIC_SUPABASE_*` no painel do serviço. Como agora o banco é o Supabase (não mais arquivos locais), **a publicação na Vercel funciona normalmente**.
