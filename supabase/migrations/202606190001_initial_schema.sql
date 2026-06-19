create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  stage text not null default 'prototype',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'provider' check (role in ('owner', 'admin', 'provider', 'viewer')),
  invited_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  membership_id uuid references public.organization_memberships(id) on delete set null,
  full_name text not null,
  title text,
  handle text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by_membership_id uuid references public.organization_memberships(id) on delete set null,
  first_name text not null,
  last_name text not null,
  pronouns text,
  phone text,
  email text,
  birth_date date,
  notes text,
  consent_signed_at timestamptz,
  consent_signature_path text,
  last_seen_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chart_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete set null,
  treatment_area text,
  modality text,
  notes text,
  treatment_summary text,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chart_images (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  chart_entry_id uuid references public.chart_entries(id) on delete cascade,
  storage_path text not null,
  caption text,
  taken_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invite_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'provider' check (role in ('owner', 'admin', 'provider', 'viewer')),
  token text not null unique,
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists organizations_slug_idx on public.organizations (slug);
create index if not exists memberships_org_idx on public.organization_memberships (organization_id);
create index if not exists memberships_user_idx on public.organization_memberships (user_id);
create index if not exists providers_org_idx on public.providers (organization_id);
create index if not exists clients_org_idx on public.clients (organization_id);
create index if not exists clients_last_seen_idx on public.clients (organization_id, last_seen_at desc);
create index if not exists chart_entries_client_idx on public.chart_entries (client_id, created_at desc);
create index if not exists chart_entries_org_idx on public.chart_entries (organization_id, created_at desc);
create index if not exists chart_images_chart_idx on public.chart_images (chart_entry_id);
create index if not exists invite_links_org_idx on public.invite_links (organization_id);

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists organization_memberships_set_updated_at on public.organization_memberships;
create trigger organization_memberships_set_updated_at
before update on public.organization_memberships
for each row execute procedure public.set_updated_at();

drop trigger if exists providers_set_updated_at on public.providers;
create trigger providers_set_updated_at
before update on public.providers
for each row execute procedure public.set_updated_at();

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute procedure public.set_updated_at();

drop trigger if exists chart_entries_set_updated_at on public.chart_entries;
create trigger chart_entries_set_updated_at
before update on public.chart_entries
for each row execute procedure public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.providers enable row level security;
alter table public.clients enable row level security;
alter table public.chart_entries enable row level security;
alter table public.chart_images enable row level security;
alter table public.invite_links enable row level security;

create policy "prototype authenticated access organizations"
on public.organizations
for all
to authenticated
using (true)
with check (true);

create policy "prototype authenticated access memberships"
on public.organization_memberships
for all
to authenticated
using (true)
with check (true);

create policy "prototype authenticated access providers"
on public.providers
for all
to authenticated
using (true)
with check (true);

create policy "prototype authenticated access clients"
on public.clients
for all
to authenticated
using (true)
with check (true);

create policy "prototype authenticated access chart_entries"
on public.chart_entries
for all
to authenticated
using (true)
with check (true);

create policy "prototype authenticated access chart_images"
on public.chart_images
for all
to authenticated
using (true)
with check (true);

create policy "prototype authenticated access invite_links"
on public.invite_links
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('client-media', 'client-media', false)
on conflict (id) do nothing;
