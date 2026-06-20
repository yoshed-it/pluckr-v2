create table if not exists public.daily_folio_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  folio_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (provider_id, client_id, folio_date)
);

create index if not exists daily_folio_entries_org_provider_idx
on public.daily_folio_entries (organization_id, provider_id, folio_date);

alter table public.daily_folio_entries enable row level security;

drop policy if exists "org members can read daily folio" on public.daily_folio_entries;
drop policy if exists "providers can manage own daily folio" on public.daily_folio_entries;

create policy "org members can read daily folio"
on public.daily_folio_entries
for select
to authenticated
using (public.is_org_member(organization_id));

create policy "providers can manage own daily folio"
on public.daily_folio_entries
for all
to authenticated
using (
  exists (
    select 1
    from public.providers provider
    join public.organization_memberships membership
      on membership.id = provider.membership_id
    where provider.id = daily_folio_entries.provider_id
      and membership.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.providers provider
    join public.organization_memberships membership
      on membership.id = provider.membership_id
    where provider.id = daily_folio_entries.provider_id
      and membership.user_id = auth.uid()
  )
);
