-- Schema for cook-shop

create extension if not exists "uuid-ossp";

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price_cents integer not null default 0,
  stock integer not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb
);

-- Optional migration from an older `settings` table
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='settings') then
    insert into public.site_settings (key, value)
    select s.key, s.value from public.settings s
    on conflict (key) do update set value = excluded.value;
  end if;
end$$;

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

-- Policies: anyone can read categories/products
create policy if not exists "read categories" on public.categories for select using (true);
create policy if not exists "read products" on public.products for select using (true);

-- Authenticated users can write (you can tighten with roles later)
create policy if not exists "write categories (auth)" on public.categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy if not exists "write products (auth)" on public.products for all using (auth.role() = 'authenticated');
create policy if not exists "write site_settings (auth)" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed
insert into public.categories (name, description, image_url) values
  ('Main Dishes', 'Hearty meals and entrees', '/placeholder.svg'),
  ('Desserts', 'Sweet treats and desserts', '/placeholder.svg'),
  ('Drinks', 'Refreshing beverages', '/placeholder.svg'),
  ('Snacks', 'Quick bites and appetizers', '/placeholder.svg')
on conflict do nothing;

insert into public.products (name, description, price_cents, stock, category_id, image_url) values
  ('Fried Rice', 'Classic fried rice with veggies', 1500, 10, (select id from public.categories where name = 'Main Dishes' limit 1), '/placeholder.svg'),
  ('Cheesecake', 'Creamy slice', 900, 8, (select id from public.categories where name = 'Desserts' limit 1), '/placeholder.svg'),
  ('Lime Juice', 'Freshly squeezed', 500, 20, (select id from public.categories where name = 'Drinks' limit 1), '/placeholder.svg')
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('business_name', jsonb_build_object('value','cook-shop')),
  ('theme', jsonb_build_object('value','light'))
on conflict (key) do nothing;
