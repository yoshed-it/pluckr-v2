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

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_org(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.role in ('owner', 'admin')
  );
$$;

create or replace function public.can_edit_org_data(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.role in ('owner', 'admin', 'provider')
  );
$$;

create or replace function public.extract_org_id_from_storage_path(object_name text)
returns uuid
language plpgsql
stable
as $$
declare
  parts text[];
begin
  parts := storage.foldername(object_name);

  if array_length(parts, 1) >= 2 and parts[1] = 'organizations' then
    begin
      return parts[2]::uuid;
    exception
      when others then
        return null;
    end;
  end if;

  return null;
end;
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.can_manage_org(uuid) from public;
revoke all on function public.can_edit_org_data(uuid) from public;

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.can_manage_org(uuid) to authenticated;
grant execute on function public.can_edit_org_data(uuid) to authenticated;
grant execute on function public.extract_org_id_from_storage_path(text) to authenticated;

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.providers enable row level security;
alter table public.clients enable row level security;
alter table public.chart_entries enable row level security;
alter table public.chart_images enable row level security;
alter table public.invite_links enable row level security;

drop policy if exists "prototype authenticated access organizations" on public.organizations;
drop policy if exists "prototype authenticated access memberships" on public.organization_memberships;
drop policy if exists "prototype authenticated access providers" on public.providers;
drop policy if exists "prototype authenticated access clients" on public.clients;
drop policy if exists "prototype authenticated access chart_entries" on public.chart_entries;
drop policy if exists "prototype authenticated access chart_images" on public.chart_images;
drop policy if exists "prototype authenticated access invite_links" on public.invite_links;

drop policy if exists "org members can read organizations" on public.organizations;
drop policy if exists "authenticated users can create organizations" on public.organizations;
drop policy if exists "org managers can update organizations" on public.organizations;
drop policy if exists "org owners and admins can delete organizations" on public.organizations;

create policy "org members can read organizations"
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

create policy "authenticated users can create organizations"
on public.organizations
for insert
to authenticated
with check (auth.uid() is not null);

create policy "org managers can update organizations"
on public.organizations
for update
to authenticated
using (public.can_manage_org(id))
with check (public.can_manage_org(id));

create policy "org owners and admins can delete organizations"
on public.organizations
for delete
to authenticated
using (public.can_manage_org(id));

drop policy if exists "org members can read memberships" on public.organization_memberships;
drop policy if exists "org managers can update memberships" on public.organization_memberships;
drop policy if exists "org managers can delete memberships" on public.organization_memberships;

create policy "org members can read memberships"
on public.organization_memberships
for select
to authenticated
using (public.is_org_member(organization_id) or user_id = auth.uid());

create policy "org managers can update memberships"
on public.organization_memberships
for update
to authenticated
using (public.can_manage_org(organization_id))
with check (public.can_manage_org(organization_id));

create policy "org managers can delete memberships"
on public.organization_memberships
for delete
to authenticated
using (public.can_manage_org(organization_id));

drop policy if exists "org members can read providers" on public.providers;
drop policy if exists "org managers can insert providers" on public.providers;
drop policy if exists "org managers can update providers" on public.providers;
drop policy if exists "org managers can delete providers" on public.providers;

create policy "org members can read providers"
on public.providers
for select
to authenticated
using (public.is_org_member(organization_id));

create policy "org managers can insert providers"
on public.providers
for insert
to authenticated
with check (public.can_manage_org(organization_id));

create policy "org managers can update providers"
on public.providers
for update
to authenticated
using (public.can_manage_org(organization_id))
with check (public.can_manage_org(organization_id));

create policy "org managers can delete providers"
on public.providers
for delete
to authenticated
using (public.can_manage_org(organization_id));

drop policy if exists "org members can read clients" on public.clients;
drop policy if exists "org editors can insert clients" on public.clients;
drop policy if exists "org editors can update clients" on public.clients;
drop policy if exists "org managers can delete clients" on public.clients;

create policy "org members can read clients"
on public.clients
for select
to authenticated
using (public.is_org_member(organization_id));

create policy "org editors can insert clients"
on public.clients
for insert
to authenticated
with check (public.can_edit_org_data(organization_id));

create policy "org editors can update clients"
on public.clients
for update
to authenticated
using (public.can_edit_org_data(organization_id))
with check (public.can_edit_org_data(organization_id));

create policy "org managers can delete clients"
on public.clients
for delete
to authenticated
using (public.can_manage_org(organization_id));

drop policy if exists "org members can read chart entries" on public.chart_entries;
drop policy if exists "org editors can insert chart entries" on public.chart_entries;
drop policy if exists "org editors can update chart entries" on public.chart_entries;
drop policy if exists "org managers can delete chart entries" on public.chart_entries;

create policy "org members can read chart entries"
on public.chart_entries
for select
to authenticated
using (public.is_org_member(organization_id));

create policy "org editors can insert chart entries"
on public.chart_entries
for insert
to authenticated
with check (public.can_edit_org_data(organization_id));

create policy "org editors can update chart entries"
on public.chart_entries
for update
to authenticated
using (public.can_edit_org_data(organization_id))
with check (public.can_edit_org_data(organization_id));

create policy "org managers can delete chart entries"
on public.chart_entries
for delete
to authenticated
using (public.can_manage_org(organization_id));

drop policy if exists "org members can read chart images" on public.chart_images;
drop policy if exists "org editors can insert chart images" on public.chart_images;
drop policy if exists "org editors can update chart images" on public.chart_images;
drop policy if exists "org managers can delete chart images" on public.chart_images;

create policy "org members can read chart images"
on public.chart_images
for select
to authenticated
using (public.is_org_member(organization_id));

create policy "org editors can insert chart images"
on public.chart_images
for insert
to authenticated
with check (public.can_edit_org_data(organization_id));

create policy "org editors can update chart images"
on public.chart_images
for update
to authenticated
using (public.can_edit_org_data(organization_id))
with check (public.can_edit_org_data(organization_id));

create policy "org managers can delete chart images"
on public.chart_images
for delete
to authenticated
using (public.can_manage_org(organization_id));

drop policy if exists "org managers can read invite links" on public.invite_links;
drop policy if exists "org managers can insert invite links" on public.invite_links;
drop policy if exists "org managers can update invite links" on public.invite_links;
drop policy if exists "org managers can delete invite links" on public.invite_links;

create policy "org managers can read invite links"
on public.invite_links
for select
to authenticated
using (public.can_manage_org(organization_id));

create policy "org managers can insert invite links"
on public.invite_links
for insert
to authenticated
with check (public.can_manage_org(organization_id));

create policy "org managers can update invite links"
on public.invite_links
for update
to authenticated
using (public.can_manage_org(organization_id))
with check (public.can_manage_org(organization_id));

create policy "org managers can delete invite links"
on public.invite_links
for delete
to authenticated
using (public.can_manage_org(organization_id));

insert into storage.buckets (id, name, public)
values ('client-media', 'client-media', false)
on conflict (id) do nothing;

drop policy if exists "org members can read client media" on storage.objects;
drop policy if exists "org editors can upload client media" on storage.objects;
drop policy if exists "org editors can update client media" on storage.objects;
drop policy if exists "org managers can delete client media" on storage.objects;

create policy "org members can read client media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'client-media'
  and public.is_org_member(public.extract_org_id_from_storage_path(name))
);

create policy "org editors can upload client media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'client-media'
  and public.can_edit_org_data(public.extract_org_id_from_storage_path(name))
);

create policy "org editors can update client media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'client-media'
  and public.can_edit_org_data(public.extract_org_id_from_storage_path(name))
)
with check (
  bucket_id = 'client-media'
  and public.can_edit_org_data(public.extract_org_id_from_storage_path(name))
);

create policy "org managers can delete client media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'client-media'
  and public.can_manage_org(public.extract_org_id_from_storage_path(name))
);
