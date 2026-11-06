-- MTANI TECH store schema (run in Supabase SQL Editor)
-- Keep customer/admin permissions enforced by RLS. Never place a service-role key in the website.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  category text not null check (category in ('Hardware', 'Software', 'Digital resources', 'Accessories')),
  description text not null default '' check (char_length(description) <= 1000),
  price numeric(12,0) not null check (price >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  total_tzs numeric(14,0) not null check (total_tzs >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, insert, update on public.orders to authenticated;

create policy "Anyone can read active products; admins can read all"
  on public.products for select to anon, authenticated
  using (active or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can insert products" on public.products for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can update products" on public.products for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can delete products" on public.products for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Customers can create their own order requests" on public.orders for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Customers and admins can read orders" on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins can update orders" on public.orders for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- To grant admin access, use Supabase Dashboard > Authentication > Users, select the
-- owner account, then assign app_metadata role=admin using a trusted admin workflow.
-- Never set admin privileges through user-editable user_metadata or frontend code.
