-- MTANI TECH marketplace schema. Run in Supabase SQL Editor.
-- Safe public listings only. Do not store service keys, passwords, or paid/private downloads here.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  category text not null,
  description text not null default '' check (char_length(description) <= 1000),
  price numeric(12,0) not null default 0 check (price >= 0),
  image_url text,
  active boolean not null default true,
  vendor_name text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  product_type text not null default 'physical',
  download_url text,
  created_at timestamptz not null default now()
);

-- Migrate an existing store table as well as supporting a fresh setup.
alter table public.products add column if not exists vendor_name text;
alter table public.products add column if not exists stock_quantity integer not null default 0;
alter table public.products add column if not exists product_type text not null default 'physical';
alter table public.products add column if not exists download_url text;
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check check (category in ('Computers','Phones','Coding & electronics','Networking','Power & solar','Software','Digital resources','Accessories','Hardware'));
alter table public.products drop constraint if exists products_product_type_check;
alter table public.products add constraint products_product_type_check check (product_type in ('physical','digital_free','digital_paid'));
alter table public.products drop constraint if exists products_download_url_check;
alter table public.products add constraint products_download_url_check check (download_url is null or product_type = 'digital_free');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  total_tzs numeric(14,0) not null check (total_tzs >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, insert, update on public.orders to authenticated;

drop policy if exists "Anyone can read active products; admins can read all" on public.products;
create policy "Anyone can read active products; admins can read all" on public.products for select to anon, authenticated
  using (active or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Customers can create their own order requests" on public.orders;
create policy "Customers can create their own order requests" on public.orders for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "Customers and admins can read orders" on public.orders;
create policy "Customers and admins can read orders" on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Public direct downloads are allowed ONLY for free resources. Do not store paid files here.
-- For paid digital goods, use a backend/payment provider to verify payment and issue short-lived signed URLs.
-- Orders submitted by the browser are enquiries; validate prices and stock server-side before accepting payment.
