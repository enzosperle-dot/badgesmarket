-- =====================================================================
-- DISCORD MARKET — SCHEMA COMPLETO DO SUPABASE
--
-- Como usar:
--   1. No painel do Supabase, abra "SQL Editor".
--   2. Cole TODO este arquivo e clique em "Run".
--   3. Pronto: tabelas, políticas (RLS), cargos e bucket de imagens criados.
--
-- Rode este script UMA vez em um projeto novo. Ele é idempotente o
-- suficiente para a maioria dos casos (usa "if not exists" / "on conflict").
-- =====================================================================

-- Extensão para gerar UUIDs.
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. CARGOS (enum)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'seller', 'admin', 'owner');
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 2. TABELA profiles
--    Guarda os dados públicos do usuário. A senha NUNCA fica aqui —
--    ela é gerenciada exclusivamente pelo Supabase Auth (auth.users).
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null,
  email      text unique not null,
  role       public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. TABELA products (anúncios)
--    Campos exatamente como pedido:
--    id, user_id, image_url, title, description, price, active, created_at
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  image_url   text,
  title       text not null,
  description text,
  price       numeric(10, 2) not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists products_user_id_idx on public.products(user_id);
create index if not exists products_active_idx on public.products(active);

-- ---------------------------------------------------------------------
-- 4. TABELA orders (pedidos)
--    Mantida para o painel admin. Como o site é só "visualizar",
--    fica vazia por padrão — pronta para uso futuro.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  buyer_id   uuid references public.profiles(id) on delete set null,
  status     text not null default 'pendente',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. FUNÇÃO AUXILIAR: descobre o cargo de um usuário
--    SECURITY DEFINER => ignora o RLS, evitando recursão nas políticas.
-- ---------------------------------------------------------------------
create or replace function public.role_of(uid uuid)
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = uid;
$$;

-- ---------------------------------------------------------------------
-- 6. TRIGGER: cria o profile automaticamente ao registrar no Auth
--    - lê o "username" enviado no cadastro (raw_user_meta_data)
--    - o email fgzinfps@gmail.com vira OWNER automaticamente
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)),
    new.email,
    case
      when lower(new.email) = 'fgzinfps@gmail.com' then 'owner'::public.user_role
      else 'user'::public.user_role
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 7. PROTEÇÃO: impede que um usuário comum mude o próprio cargo
--    (só o owner pode alterar cargos).
-- ---------------------------------------------------------------------
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and public.role_of(auth.uid()) <> 'owner' then
    raise exception 'Sem permissão para alterar o cargo.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_block_role_change on public.profiles;
create trigger profiles_block_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- ---------------------------------------------------------------------
-- 8. RPC: verificar se um username está disponível (usado no cadastro)
-- ---------------------------------------------------------------------
create or replace function public.is_username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.profiles where lower(username) = lower(trim(name))
  );
$$;
grant execute on function public.is_username_available(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 9. RPC: owner altera o cargo de um usuário (usado no painel admin)
-- ---------------------------------------------------------------------
create or replace function public.set_user_role(target uuid, new_role public.user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.role_of(auth.uid()) <> 'owner' then
    raise exception 'Apenas o owner pode alterar cargos.';
  end if;
  update public.profiles set role = new_role where id = target;
end;
$$;
grant execute on function public.set_user_role(uuid, public.user_role) to authenticated;

-- ---------------------------------------------------------------------
-- 10. VIEW pública do catálogo
--     Expõe os anúncios ATIVOS + o username do vendedor, SEM expor email.
--     A view roda com privilégios do dono (ignora o RLS das tabelas),
--     por isso anon/usuários veem o username sem ler a tabela profiles.
-- ---------------------------------------------------------------------
create or replace view public.catalog as
  select
    p.id,
    p.user_id,
    p.image_url,
    p.title,
    p.description,
    p.price,
    p.created_at,
    pr.username as seller_username
  from public.products p
  join public.profiles pr on pr.id = p.user_id
  where p.active = true;

grant select on public.catalog to anon, authenticated;

-- =====================================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- ----- profiles -----
-- Ver: o próprio usuário vê seu perfil; admin/owner veem todos.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (
    id = auth.uid() or public.role_of(auth.uid()) in ('admin', 'owner')
  );

-- Atualizar: o próprio usuário (username) ou o owner (qualquer um).
-- A troca de cargo é barrada pelo trigger acima para quem não é owner.
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (
    id = auth.uid() or public.role_of(auth.uid()) = 'owner'
  ) with check (
    id = auth.uid() or public.role_of(auth.uid()) = 'owner'
  );

-- ----- products -----
-- Ver: qualquer um vê anúncios ativos; o dono vê os seus (mesmo inativos);
--      admin/owner veem todos.
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select using (
    active = true
    or user_id = auth.uid()
    or public.role_of(auth.uid()) in ('admin', 'owner')
  );

-- Criar: qualquer usuário logado, vinculando o anúncio a si mesmo.
drop policy if exists products_insert on public.products;
create policy products_insert on public.products
  for insert with check (user_id = auth.uid());

-- Editar: o dono do anúncio ou admin/owner.
drop policy if exists products_update on public.products;
create policy products_update on public.products
  for update using (
    user_id = auth.uid() or public.role_of(auth.uid()) in ('admin', 'owner')
  ) with check (
    user_id = auth.uid() or public.role_of(auth.uid()) in ('admin', 'owner')
  );

-- Excluir: o dono do anúncio ou admin/owner.
drop policy if exists products_delete on public.products;
create policy products_delete on public.products
  for delete using (
    user_id = auth.uid() or public.role_of(auth.uid()) in ('admin', 'owner')
  );

-- ----- orders -----
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select using (
    buyer_id = auth.uid() or public.role_of(auth.uid()) in ('admin', 'owner')
  );

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert with check (buyer_id = auth.uid());

-- =====================================================================
-- 12. STORAGE — bucket público "product-images"
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Leitura pública das imagens.
drop policy if exists product_images_read on storage.objects;
create policy product_images_read on storage.objects
  for select using (bucket_id = 'product-images');

-- Upload apenas para usuários logados.
drop policy if exists product_images_insert on storage.objects;
create policy product_images_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

-- Atualizar/Remover apenas usuários logados.
drop policy if exists product_images_update on storage.objects;
create policy product_images_update on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists product_images_delete on storage.objects;
create policy product_images_delete on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- =====================================================================
-- FIM. Lembre-se de desativar "Confirm email" em Authentication >
-- Providers > Email se quiser login imediato após o cadastro (MVP).
-- =====================================================================
